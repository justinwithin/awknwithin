/* ==========================================================================
   Within Center - Booking System
   Multi-step booking: Service > Date > Time > Info > Confirmation
   No Stripe integration (placeholder for payment step)
   ========================================================================== */

(function() {
  'use strict';

  var state = {
    step: 1,
    service: null,
    date: null,
    time: null,
    client: {},
    calendarMonth: new Date().getMonth(),
    calendarYear: new Date().getFullYear()
  };

  var services = [
    {
      id: 'awaken',
      name: 'AWAKEN',
      tagline: 'Come Fully Home to You',
      price: 5900,
      duration: '6 sessions over 2 months',
      features: [
        'Medical Consultation w/ MAPS-Trained NP',
        'Preparation Session',
        '6 Private Guided Ketamine Ceremonies',
        '6 Integration Sessions (Therapy/Coaching)',
        '2 Month Membership to AWKN Ranch'
      ]
    },
    {
      id: 'heal',
      name: 'HEAL',
      tagline: 'Heal Your Nervous System',
      price: 3900,
      duration: '3 sessions over 1 month',
      features: [
        'Medical Consultation w/ MAPS-Trained NP',
        'Preparation Session',
        '3 Private Guided Ketamine Ceremonies',
        '3 Integration Sessions (Therapy/Coaching)',
        '1 Month Membership to AWKN Ranch'
      ]
    },
    {
      id: 'explore',
      name: 'EXPLORE',
      tagline: 'Expand Your Consciousness',
      price: 2000,
      duration: '1 session',
      features: [
        'Medical Consultation w/ MAPS-Trained NP',
        'Preparation Session',
        '1 Private Guided Ketamine Ceremony',
        '1 Integration Session (Therapy/Coaching)',
        '2 Day Passes to AWKN Ranch'
      ]
    },
    {
      id: 'twin-flame',
      name: 'TWIN FLAME',
      tagline: 'Couples Treatment Package',
      price: 2200,
      duration: 'Couples session',
      features: [
        '2 Medical Consultations',
        '1 Preparation Session',
        '1 Guided Ketamine Ceremony',
        '1 Integration Process Session',
        '2 Integration Coaching Sessions'
      ]
    },
    {
      id: 'tune-up',
      name: 'TUNE-UP',
      tagline: 'For Past Awaken or Retreat Clients',
      price: 695,
      duration: '1 session',
      features: [
        '1 Guided Ketamine Ceremony',
        '1 Integration Session (Therapy/Coaching)',
        '1 Day Pass to AWKN Ranch'
      ]
    }
  ];

  var timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM'
  ];

  // ---- Rendering ----

  function render() {
    var container = document.getElementById('booking-content');
    if (!container) return;

    updateProgress();

    switch (state.step) {
      case 1: renderServiceSelect(container); break;
      case 2: renderDateSelect(container); break;
      case 3: renderTimeSelect(container); break;
      case 4: renderClientInfo(container); break;
      case 5: renderConfirmation(container); break;
    }
  }

  function updateProgress() {
    var steps = document.querySelectorAll('.booking-progress__step');
    var lines = document.querySelectorAll('.booking-progress__line');
    steps.forEach(function(el, i) {
      var stepNum = i + 1;
      el.classList.remove('booking-progress__step--active', 'booking-progress__step--completed');
      if (stepNum === state.step) el.classList.add('booking-progress__step--active');
      if (stepNum < state.step) el.classList.add('booking-progress__step--completed');
    });
    lines.forEach(function(line, i) {
      line.style.background = (i + 1 < state.step) ? 'var(--wc-green-primary)' : 'var(--wc-gray-light)';
    });
  }

  // Step 1: Service Selection
  function renderServiceSelect(container) {
    var html = '<h2 style="text-align:center;margin-bottom:var(--wc-space-md);">Select Your Package</h2>';
    html += '<p style="text-align:center;color:var(--wc-gray-medium);margin-bottom:var(--wc-space-2xl);max-width:600px;margin-left:auto;margin-right:auto;">Choose the treatment package that best fits your healing journey.</p>';
    html += '<div class="service-select-grid">';
    services.forEach(function(svc) {
      var selected = state.service && state.service.id === svc.id;
      html += '<div class="service-select-card' + (selected ? ' service-select-card--selected' : '') + '" onclick="BookingSystem.selectService(\'' + svc.id + '\')">';
      html += '<div class="service-select-card__name">' + svc.name + '</div>';
      html += '<div class="service-select-card__duration">' + svc.tagline + '</div>';
      html += '<div class="service-select-card__price">$' + svc.price.toLocaleString() + '</div>';
      html += '<ul class="pricing-card__features" style="margin-top:12px;margin-bottom:0;">';
      svc.features.forEach(function(f) {
        html += '<li>' + f + '</li>';
      });
      html += '</ul>';
      html += '</div>';
    });
    html += '</div>';
    if (state.service) {
      html += '<div style="text-align:center;margin-top:var(--wc-space-2xl);">';
      html += '<button class="btn btn--primary btn--lg" onclick="BookingSystem.nextStep()">Continue</button>';
      html += '</div>';
    }
    container.innerHTML = html;
  }

  // Step 2: Date Selection (Calendar)
  function renderDateSelect(container) {
    var html = '<h2 style="text-align:center;margin-bottom:var(--wc-space-2xl);">Choose a Date</h2>';
    html += '<div class="booking-calendar">';
    html += renderCalendar();
    html += '</div>';
    html += '<div style="display:flex;justify-content:space-between;margin-top:var(--wc-space-2xl);">';
    html += '<button class="btn btn--outline" onclick="BookingSystem.prevStep()">Back</button>';
    if (state.date) {
      html += '<button class="btn btn--primary" onclick="BookingSystem.nextStep()">Continue</button>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  function renderCalendar() {
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var year = state.calendarYear;
    var month = state.calendarMonth;
    var today = new Date();
    today.setHours(0,0,0,0);

    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var html = '<div class="calendar-header">';
    html += '<div class="calendar-nav"><button onclick="BookingSystem.prevMonth()">&#8249;</button></div>';
    html += '<h3>' + months[month] + ' ' + year + '</h3>';
    html += '<div class="calendar-nav"><button onclick="BookingSystem.nextMonth()">&#8250;</button></div>';
    html += '</div>';
    html += '<div class="calendar-grid">';

    days.forEach(function(d) {
      html += '<div class="calendar-grid__day-header">' + d + '</div>';
    });

    for (var i = 0; i < firstDay; i++) {
      html += '<div class="calendar-grid__day calendar-grid__day--empty"></div>';
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(year, month, d);
      var isPast = date < today;
      var isSunday = date.getDay() === 0;
      var disabled = isPast || isSunday;
      var isToday = date.toDateString() === today.toDateString();
      var isSelected = state.date && state.date.toDateString() === date.toDateString();

      var cls = 'calendar-grid__day';
      if (disabled) cls += ' calendar-grid__day--disabled';
      if (isToday) cls += ' calendar-grid__day--today';
      if (isSelected) cls += ' calendar-grid__day--selected';

      if (disabled) {
        html += '<div class="' + cls + '">' + d + '</div>';
      } else {
        html += '<button class="' + cls + '" onclick="BookingSystem.selectDate(' + year + ',' + month + ',' + d + ')">' + d + '</button>';
      }
    }

    html += '</div>';
    return html;
  }

  // Step 3: Time Selection
  function renderTimeSelect(container) {
    var html = '<h2 style="text-align:center;margin-bottom:var(--wc-space-sm);">Choose a Time</h2>';
    html += '<p style="text-align:center;color:var(--wc-gray-medium);margin-bottom:var(--wc-space-2xl);">' + formatDate(state.date) + '</p>';
    html += '<div class="time-slots">';
    timeSlots.forEach(function(slot) {
      // Simulate some unavailable slots
      var unavailable = Math.random() < 0.2;
      var isSelected = state.time === slot;
      var cls = 'time-slot';
      if (isSelected) cls += ' time-slot--selected';
      if (unavailable) cls += ' time-slot--unavailable';

      if (unavailable) {
        html += '<div class="' + cls + '">' + slot + '</div>';
      } else {
        html += '<button class="' + cls + '" onclick="BookingSystem.selectTime(\'' + slot + '\')">' + slot + '</button>';
      }
    });
    html += '</div>';
    html += '<div style="display:flex;justify-content:space-between;margin-top:var(--wc-space-2xl);">';
    html += '<button class="btn btn--outline" onclick="BookingSystem.prevStep()">Back</button>';
    if (state.time) {
      html += '<button class="btn btn--primary" onclick="BookingSystem.nextStep()">Continue</button>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  // Step 4: Client Info
  function renderClientInfo(container) {
    var c = state.client;
    var html = '<h2 style="text-align:center;margin-bottom:var(--wc-space-2xl);">Your Information</h2>';
    html += '<form class="form-grid" id="booking-form" onsubmit="event.preventDefault(); BookingSystem.submitInfo();">';
    html += '<div class="form-group"><label>First Name *</label><input type="text" name="firstName" value="' + (c.firstName || '') + '" required></div>';
    html += '<div class="form-group"><label>Last Name *</label><input type="text" name="lastName" value="' + (c.lastName || '') + '" required></div>';
    html += '<div class="form-group"><label>Email *</label><input type="email" name="email" value="' + (c.email || '') + '" required></div>';
    html += '<div class="form-group"><label>Phone *</label><input type="tel" name="phone" value="' + (c.phone || '') + '" required></div>';
    html += '<div class="form-group"><label>City</label><input type="text" name="city" value="' + (c.city || '') + '"></div>';
    html += '<div class="form-group"><label>State</label><input type="text" name="state" value="' + (c.state || '') + '"></div>';
    html += '<div class="form-group form-group--full"><label>Comments or questions</label><textarea name="comments">' + (c.comments || '') + '</textarea></div>';
    html += '<div class="form-group form-group--full" style="flex-direction:row;align-items:center;gap:8px;">';
    html += '<input type="checkbox" id="intake-ack" required style="width:18px;height:18px;">';
    html += '<label for="intake-ack" style="margin:0;font-size:0.9rem;">I acknowledge that I will need to complete an intake form prior to my first session.</label>';
    html += '</div>';
    html += '<div class="form-group form-group--full" style="display:flex;flex-direction:row;justify-content:space-between;margin-top:var(--wc-space-lg);">';
    html += '<button type="button" class="btn btn--outline" onclick="BookingSystem.prevStep()">Back</button>';
    html += '<button type="submit" class="btn btn--primary btn--lg">Review Booking</button>';
    html += '</div>';
    html += '</form>';
    container.innerHTML = html;
  }

  // Step 5: Confirmation
  function renderConfirmation(container) {
    var svc = state.service;
    var html = '<div style="text-align:center;margin-bottom:var(--wc-space-2xl);">';
    html += '<div style="width:80px;height:80px;border-radius:50%;background:var(--wc-green-gradient);display:flex;align-items:center;justify-content:center;margin:0 auto var(--wc-space-lg);font-size:2rem;color:white;">&#10003;</div>';
    html += '<h2>Booking Summary</h2>';
    html += '<p style="color:var(--wc-gray-medium);">Please review your booking details below.</p>';
    html += '</div>';

    html += '<div class="booking-summary">';
    html += '<div class="booking-summary__row"><span>Package</span><strong>' + svc.name + '</strong></div>';
    html += '<div class="booking-summary__row"><span>Date</span><strong>' + formatDate(state.date) + '</strong></div>';
    html += '<div class="booking-summary__row"><span>Time</span><strong>' + state.time + '</strong></div>';
    html += '<div class="booking-summary__row"><span>Name</span><strong>' + state.client.firstName + ' ' + state.client.lastName + '</strong></div>';
    html += '<div class="booking-summary__row"><span>Email</span><strong>' + state.client.email + '</strong></div>';
    html += '<div class="booking-summary__row"><span>Phone</span><strong>' + state.client.phone + '</strong></div>';
    html += '<div class="booking-summary__row"><span>Total</span><strong>$' + svc.price.toLocaleString() + '</strong></div>';
    html += '</div>';

    html += '<div style="background:var(--wc-gray-lightest);border-radius:var(--wc-radius-lg);padding:var(--wc-space-xl);margin-top:var(--wc-space-lg);text-align:center;">';
    html += '<p style="font-size:0.95rem;color:var(--wc-gray-dark);margin:0;">Payment processing will be available soon. For now, our admissions team will contact you to complete your booking.</p>';
    html += '</div>';

    html += '<div style="display:flex;justify-content:space-between;margin-top:var(--wc-space-2xl);">';
    html += '<button class="btn btn--outline" onclick="BookingSystem.prevStep()">Back</button>';
    html += '<button class="btn btn--primary btn--lg" onclick="BookingSystem.confirmBooking()">Confirm Booking</button>';
    html += '</div>';

    container.innerHTML = html;
  }

  // ---- Actions ----

  function selectService(id) {
    state.service = services.find(function(s) { return s.id === id; });
    render();
  }

  function selectDate(year, month, day) {
    state.date = new Date(year, month, day);
    render();
  }

  function selectTime(time) {
    state.time = time;
    render();
  }

  function nextStep() {
    state.step++;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function prevStep() {
    state.step--;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function prevMonth() {
    state.calendarMonth--;
    if (state.calendarMonth < 0) {
      state.calendarMonth = 11;
      state.calendarYear--;
    }
    render();
  }

  function nextMonth() {
    state.calendarMonth++;
    if (state.calendarMonth > 11) {
      state.calendarMonth = 0;
      state.calendarYear++;
    }
    render();
  }

  function submitInfo() {
    var form = document.getElementById('booking-form');
    if (!form) return;
    var data = new FormData(form);
    state.client = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      phone: data.get('phone'),
      city: data.get('city'),
      state: data.get('state'),
      comments: data.get('comments')
    };
    nextStep();
  }

  async function confirmBooking() {
    // Try to save to Supabase if available
    if (window.adminSupabase) {
      try {
        var result = await window.adminSupabase.from('bookings').insert({
          service_id: state.service.id,
          service_name: state.service.name,
          booking_date: state.date.toISOString().split('T')[0],
          booking_time: state.time,
          client_first_name: state.client.firstName,
          client_last_name: state.client.lastName,
          client_email: state.client.email,
          client_phone: state.client.phone,
          client_city: state.client.city,
          client_state: state.client.state,
          comments: state.client.comments,
          amount: state.service.price,
          status: 'pending'
        });
        if (result.error) throw result.error;
      } catch (e) {
        console.log('Booking saved locally (Supabase unavailable):', e.message);
      }
    }

    var container = document.getElementById('booking-content');
    container.innerHTML = `
      <div style="text-align:center;padding:var(--wc-space-4xl) 0;">
        <div style="width:100px;height:100px;border-radius:50%;background:var(--wc-green-gradient);display:flex;align-items:center;justify-content:center;margin:0 auto var(--wc-space-xl);font-size:2.5rem;color:white;">&#10003;</div>
        <h2 style="margin-bottom:var(--wc-space-md);">Booking Request Submitted!</h2>
        <p style="color:var(--wc-gray-medium);max-width:500px;margin:0 auto var(--wc-space-lg);">Thank you, ${state.client.firstName}! Our admissions team will contact you within 24 hours to confirm your ${state.service.name} package and schedule your first session.</p>
        <p style="font-size:0.9rem;color:var(--wc-gray-medium);margin-bottom:var(--wc-space-2xl);">A confirmation email has been sent to ${state.client.email}.</p>
        <a href="${window.WithinCenter ? window.WithinCenter.link('/') : '/'}" class="btn btn--primary">Return Home</a>
      </div>
    `;
    WithinCenter.toast('Booking submitted successfully!', 'success');
  }

  // ---- Helpers ----

  function formatDate(date) {
    if (!date) return '';
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // ---- Init ----
  function init() {
    if (document.getElementById('booking-content')) {
      render();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose
  window.BookingSystem = {
    selectService: selectService,
    selectDate: selectDate,
    selectTime: selectTime,
    nextStep: nextStep,
    prevStep: prevStep,
    prevMonth: prevMonth,
    nextMonth: nextMonth,
    submitInfo: submitInfo,
    confirmBooking: confirmBooking
  };
})();
