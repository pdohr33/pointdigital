/* ==========================================================================
   Point Digital - Script
   ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       Mobile Nav Toggle
       ------------------------------------------------------------------ */

    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        var links = menu.querySelectorAll('.nav-link');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function () {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            });
        }
    }

    /* ------------------------------------------------------------------
       Smooth Scroll
       ------------------------------------------------------------------ */

    var scrollLinks = document.querySelectorAll('a[href^="#"]');
    for (var j = 0; j < scrollLinks.length; j++) {
        scrollLinks[j].addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            var offset = 72; // nav height
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    }

    /* ------------------------------------------------------------------
       Scroll Animations (Intersection Observer)
       ------------------------------------------------------------------ */

    var animateElements = document.querySelectorAll('.animate-in');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                for (var k = 0; k < entries.length; k++) {
                    if (entries[k].isIntersecting) {
                        entries[k].target.classList.add('visible');
                        observer.unobserve(entries[k].target);
                    }
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        for (var m = 0; m < animateElements.length; m++) {
            observer.observe(animateElements[m]);
        }
    } else {
        // Fallback: show everything immediately
        for (var n = 0; n < animateElements.length; n++) {
            animateElements[n].classList.add('visible');
        }
    }

    /* ------------------------------------------------------------------
       Nav Background on Scroll
       ------------------------------------------------------------------ */

    var nav = document.getElementById('nav');
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
        var current = window.pageYOffset;
        if (current > 50) {
            nav.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            nav.style.background = 'rgba(15, 23, 42, 0.95)';
        }
        lastScroll = current;
    });

    /* ------------------------------------------------------------------
       Contact Form Handler
       ------------------------------------------------------------------ */

    var form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function (e) {
            // Let formsubmit.co handle it if available.
            // If we want a JS-only fallback, intercept and use mailto.
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var phone = document.getElementById('phone').value;
            var message = document.getElementById('message').value;

            // Simple validation
            if (!name || !email || !message) {
                e.preventDefault();
                alert('Please fill in all required fields.');
                return;
            }

            // Check for valid email
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
                return;
            }

            // Allow form to submit to formsubmit.co
            // The form action handles the rest
        });
    }
})();
