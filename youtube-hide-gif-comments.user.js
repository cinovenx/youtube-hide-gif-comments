// ==UserScript==
// @name         Hide YouTube Comment GIFs
// @namespace    https://github.com/cinovenx/
// @version      1.0.0
// @description  Hides GIFs / image attachments in YouTube comments (ytw-comment-image-attachment-view-model)
// @author       cinovenx
// @homepage     https://github.com/cinovenx/youtube-hide-gif-comments
// @supportURL   https://github.com/cinovenx/youtube-hide-gif-comments/issues
// @match        https://www.youtube.com/*
// @match        https://music.youtube.com/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    var SELECTORS = [
        'ytw-comment-image-attachment-view-model',
        '.ytwCommentImageAttachmentViewModelHost',
        '.ytwCommentImageAttachmentViewModelImageContainer',
        // Fallbacks: catch comment images by CDN even if YouTube renames the tag
        'ytd-comment-view-model img[src*="i.ytimg.com/c_exp/"]',
        'ytd-comment-renderer img[src*="i.ytimg.com/c_exp/"]'
    ].join(',');

    // 1. CSS — hides GIFs immediately, even before the JS observer kicks in.
    // Avatars and small emojis are not affected: they use different src/classes.
    function injectCss() {
        var css = SELECTORS + '{display:none!important;}';
        var style = document.createElement('style');
        style.setAttribute('data-yt-hide-gifs', 'true');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    // 2. JS — backup for SPA lazy-loading (scroll, replies, navigation between videos).
    function hideIn(root) {
        if (!root || !root.querySelectorAll) return;
        var nodes;
        try {
            nodes = root.querySelectorAll(SELECTORS);
        } catch (e) {
            return;
        }
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            // If this is an <img> matched by a fallback selector — hide the whole attachment box if present
            if (el.tagName === 'IMG') {
                var box = el.closest('ytw-comment-image-attachment-view-model');
                if (box) box.style.setProperty('display', 'none', 'important');
                el.style.setProperty('display', 'none', 'important');
            } else {
                el.style.setProperty('display', 'none', 'important');
            }
        }
    }

    injectCss();
    hideIn(document);

    var scheduled = false;
    function schedule() {
        if (scheduled) return;
        scheduled = true;
        var run = function () {
            scheduled = false;
            hideIn(document);
        };
        if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
        else setTimeout(run, 50);
    }

    function startObserver() {
        if (!document.documentElement) {
            setTimeout(startObserver, 50);
            return;
        }
        var observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];
                if (m.addedNodes && m.addedNodes.length) {
                    schedule();
                    break;
                }
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    startObserver();

    // YouTube SPA navigation without a full page reload
    document.addEventListener('yt-navigate-finish', function () {
        hideIn(document);
        schedule();
    });

    // Safety net for the first seconds (comments render lazily)
    var tries = 0;
    var timer = setInterval(function () {
        hideIn(document);
        if (++tries >= 8) clearInterval(timer);
    }, 2000);
})();
