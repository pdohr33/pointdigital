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
       Checkout Modal
       ------------------------------------------------------------------ */

    var modal = document.getElementById('checkout-modal');
    var modalClose = document.getElementById('modal-close');
    var modalPlanName = document.getElementById('modal-plan-name');
    var checkoutForm = document.getElementById('checkout-form');
    var checkoutSubmit = document.getElementById('checkout-submit');
    var selectedPriceId = null;

    // Open modal from pricing buttons
    var checkoutBtns = document.querySelectorAll('.checkout-btn');
    for (var cb = 0; cb < checkoutBtns.length; cb++) {
        checkoutBtns[cb].addEventListener('click', function () {
            selectedPriceId = this.getAttribute('data-price');
            modalPlanName.textContent = this.getAttribute('data-plan');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            var firstInput = document.getElementById('checkout-name');
            if (firstInput) firstInput.focus();
        });
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        selectedPriceId = null;
        checkoutSubmit.disabled = false;
        checkoutSubmit.textContent = 'Continue to Payment';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle checkout form submit
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!selectedPriceId) return;

            var name = document.getElementById('checkout-name').value.trim();
            var email = document.getElementById('checkout-email').value.trim();
            var business = document.getElementById('checkout-business').value.trim();

            if (!name || !email || !business) return;

            checkoutSubmit.disabled = true;
            checkoutSubmit.textContent = 'Redirecting...';

            fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: selectedPriceId,
                    customerName: name,
                    customerEmail: email,
                    businessName: business,
                }),
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data.url) {
                        window.location.href = data.url;
                    } else {
                        alert('Something went wrong. Please try again.');
                        checkoutSubmit.disabled = false;
                        checkoutSubmit.textContent = 'Continue to Payment';
                    }
                })
                .catch(function () {
                    alert('Connection error. Please try again.');
                    checkoutSubmit.disabled = false;
                    checkoutSubmit.textContent = 'Continue to Payment';
                });
        });
    }

    // Handle checkout success/cancel from URL params
    var urlParams = new URLSearchParams(window.location.search);
    var checkoutStatus = urlParams.get('checkout');
    var toast = document.getElementById('toast');

    if (checkoutStatus === 'success' && toast) {
        toast.className = 'toast toast-success';
        toast.textContent = 'Payment successful! We will be in touch within 24 hours.';
        setTimeout(function () { toast.className = 'toast'; }, 6000);
        history.replaceState(null, '', window.location.pathname);
    } else if (checkoutStatus === 'cancel' && toast) {
        toast.className = 'toast toast-cancel';
        toast.textContent = 'Checkout cancelled. No charge was made.';
        setTimeout(function () { toast.className = 'toast'; }, 5000);
        history.replaceState(null, '', window.location.pathname);
    }

    /* ------------------------------------------------------------------
       Contact Form Handler
       ------------------------------------------------------------------ */

    var form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var phone = document.getElementById('phone').value.trim();
            var message = document.getElementById('message').value.trim();
            var honey = form.querySelector('[name="_honey"]').value;

            // Honeypot check
            if (honey) return;

            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            var submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, email: email, phone: phone, message: message }),
            })
                .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
                .then(function (result) {
                    if (result.ok) {
                        form.reset();
                        submitBtn.textContent = 'Message Sent!';
                        setTimeout(function () {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Send Message';
                        }, 3000);
                    } else {
                        alert(result.data.error || 'Something went wrong. Please try again.');
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                    }
                })
                .catch(function () {
                    alert('Connection error. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                });
        });
    }
})();
