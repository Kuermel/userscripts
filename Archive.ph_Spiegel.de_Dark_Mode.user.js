// ==UserScript==
// @name         Archive.ph Spiegel.de Premium Dark Mode (V18 Custom Chart Text White)
// @namespace    http://tampermonkey.net
// @version      18.7
// @description  Echter Darkmode im Spiegel-Design für Text-Archive. Synchronisiert den Darkmode-Status perfekt in die Diagramm-iFrames.
// @author       Dein Name
// @match        https://archive.ph/*
// @match        https://archive.is/*
// @match        https://archive.today/*
// @match        https://archive.li/*
// @match        https://archive.vn/*
// @match        https://archive.md/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-body
// @allFrames    true
// ==/UserScript==

(function() {
    'use strict';

    const isMainFrame = (window.self === window.top);

    const spiegelDarkCSS = `
        /* ==================================================================
           LOGIK FÜR DIE HAUPTSEITE (Färbt Layout & schützt Artikelfotos)
           ================================================================== */
        html.spiegel-darkmode, html.spiegel-darkmode body,
        html.spiegel-darkmode main, html.spiegel-darkmode article,
        html.spiegel-darkmode section, html.spiegel-darkmode header,
        html.spiegel-darkmode footer, html.spiegel-darkmode table,
        html.spiegel-darkmode tr, html.spiegel-darkmode td,
        html.spiegel-darkmode tbody, html.spiegel-darkmode #HEADER,
        html.spiegel-darkmode #TOOLBAR, html.spiegel-darkmode .HEADER,
        html.spiegel-darkmode .TOOLBAR {
            background-color: #0b121e !important;
            color: #e2e8f0 !important;
        }

        /* Verhindert das Übermalen von Teaser- & Hintergrundbildern auf der Hauptseite */
        html.spiegel-darkmode div[style*="background"] {
            background-color: transparent !important;
        }
        html.spiegel-darkmode div[x-data*="translateY"],
        html.spiegel-darkmode div:has(picture),
        html.spiegel-darkmode div:has(img),
        html.spiegel-darkmode picture,
        html.spiegel-darkmode img {
            background-color: transparent !important;
            filter: none !important;
        }

        /* ==================================================================
           URSPRÜNGLICHER DATAWRAPPER-DIAGRAMM FIX (Aus V18 übernommen)
           ================================================================== */

        /* Zwingt alle Texte und Überschriften im Diagramm vorab auf Schwarz (#000) */
        html.spiegel-darkmode [id^="datawrapper-chart-"] div,
        html.spiegel-darkmode [id^="datawrapper-chart-"] span,
        html.spiegel-darkmode [id^="datawrapper-chart-"] h3,
        html.spiegel-darkmode [id^="datawrapper-chart-"] h3 span,
        html.spiegel-darkmode [id^="datawrapper-chart-"] [style*="color"],
        html.spiegel-darkmode .dw-chart div,
        html.spiegel-darkmode .dw-chart span,
        html.spiegel-darkmode .dw-chart td,
        html.spiegel-darkmode .dw-chart th {
            background-color: transparent !important;
            color: #000000 !important; /* Wird durch Invertierung zu reinem Weiß */
        }

        /* Der optimierte CSS-Filter für den Diagramm-Container / iFrame-Inhalt */
        html.spiegel-darkmode [id^="datawrapper-chart-"],
        html.spiegel-darkmode body.dw-chart,
        html.spiegel-darkmode #wrapper {
            background-color: #ffffff !important;
            filter: invert(0.93) hue-rotate(195deg) brightness(1.1) contrast(1.2) !important;
            border-radius: 4px;
        }

        /* iFrame-Rahmen auf der Hauptseite säubern */
        html.spiegel-darkmode iframe[src*="datawrapper"] {
            background-color: #ffffff !important;
            border: none !important;
        }

        /* ==================================================================
           ALLGEMEINE TEXT- UND LINKSTYLES
           ================================================================== */
        html.spiegel-darkmode p, html.spiegel-darkmode li,
        html.spiegel-darkmode span, html.spiegel-darkmode a,
        html.spiegel-darkmode b, html.spiegel-darkmode strong,
        html.spiegel-darkmode i, html.spiegel-darkmode em,
        html.spiegel-darkmode font, html.spiegel-darkmode center {
            color: #e2e8f0 !important;
        }

        html.spiegel-darkmode h1, html.spiegel-darkmode h2,
        html.spiegel-darkmode h3, html.spiegel-darkmode h4,
        html.spiegel-darkmode h5, html.spiegel-darkmode h6,
        html.spiegel-darkmode .title, html.spiegel-darkmode [class*="heading"],
        html.spiegel-darkmode [class*="headline"] {
            color: #ffffff !important;
        }

        html.spiegel-darkmode a, html.spiegel-darkmode a font, html.spiegel-darkmode a span {
            color: #4da3ff !important;
            text-decoration: none !important;
        }
        html.spiegel-darkmode a:hover {
            text-decoration: underline !important;
        }

        html.spiegel-darkmode [class*="plus-"], html.spiegel-darkmode .spiegel-plus,
        html.spiegel-darkmode [style*="color: rgb(224, 0, 0)"] {
            color: #f04e4e !important;
        }

        html.spiegel-darkmode hr, html.spiegel-darkmode border {
            border-color: #22314d !important;
        }
    `;

    const buttonCSS = `
        #darkmode-toggle-btn {
            position: fixed !important;
            top: 10px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            padding: 8px 14px !important;
            border-radius: 20px !important;
            border: 1px solid #22314d !important;
            background-color: #131c2e !important;
            color: #e2e8f0 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            font-size: 13px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
            display: block !important;
        }
    `;

    // Erkennung, ob es sich um eine archivierte Spiegel-Seite handelt
    const htmlText = document.documentElement.innerHTML.toLowerCase();
    const isSpiegel = window.location.href.includes('spiegel.de') ||
                      htmlText.includes('spiegel.de') ||
                      document.title.toLowerCase().includes('spiegel') ||
                      document.body.classList.contains('dw-chart'); // iFrame-Erkennung

    if (isSpiegel) {
        // Styles injizieren
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(spiegelDarkCSS + buttonCSS);
        } else {
            const style = document.createElement('style');
            style.textContent = spiegelDarkCSS + buttonCSS;
            document.head.appendChild(style);
        }

        // Darkmode-Status aus dem localStorage auslesen
        let isEnabled = localStorage.getItem('spiegel-darkmode-enabled') !== 'false';

        if (isEnabled) {
            document.documentElement.classList.add('spiegel-darkmode');
        }

        // Event-Umschalter für die Hauptseite
        const toggleMode = () => {
            isEnabled = !isEnabled;
            document.documentElement.classList.toggle('spiegel-darkmode', isEnabled);
            localStorage.setItem('spiegel-darkmode-enabled', isEnabled);

            const btn = document.getElementById('darkmode-toggle-btn');
            if (btn) btn.innerText = isEnabled ? '🌓 Darkmode: An' : '🌓 Darkmode: Aus';

            // iFrames auf der Seite über die Änderung informieren
            document.querySelectorAll('iframe').forEach(iframe => {
                try {
                    iframe.contentWindow.postMessage({ type: 'SU_TOGGLE_DARKMODE', value: isEnabled }, '*');
                } catch(e) { /* Cross-Origin Schutz abfangen falls nötig */ }
            });
        };

        // Nachricht empfangen (für iFrames)
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SU_TOGGLE_DARKMODE') {
                document.documentElement.classList.toggle('spiegel-darkmode', event.data.value);
            }
        });

        if (typeof GM_registerMenuCommand !== 'undefined' && isMainFrame) {
            GM_registerMenuCommand("🌓 Darkmode Umschalten", toggleMode);
        }

        // Button nur auf der Hauptseite rendern
        if (isMainFrame) {
            const injectButton = () => {
                if (document.getElementById('darkmode-toggle-btn')) return;
                const btn = document.createElement('button');
                btn.id = 'darkmode-toggle-btn';
                btn.innerText = isEnabled ? '🌓 Darkmode: An' : '🌓 Darkmode: Aus';
                btn.addEventListener('click', toggleMode);
                document.body.appendChild(btn);
            };

            if (document.readyState === 'loading') {
                document.addEventListener("DOMContentLoaded", injectButton);
            } else {
                injectButton();
            }
        }
    }
})();
