/* =========================================================
   TOEFL & SHIPPING COMMAND CENTER
   Minimal interaction script

   01. Hero start form
   02. Flashcard deck (active recall)
   03. Customer service roleplay
   04. Mobile navigation auto-close
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     01. HERO START FORM
     Local confirmation only: the page has no back end.
     ======================================================= */

  var startForm = document.getElementById("startForm");

  if (startForm) {
    var formNote = document.getElementById("formNote");
    var emailField = document.getElementById("studentEmail");
    var goalField = document.getElementById("studyGoal");

    var plans = {
      toefl: "TOEFL C1 preparation: grammar lab, reading precision and weekly practice tests.",
      shipping: "Shipping & logistics English: tracking, customs and delivery vocabulary.",
      service: "Customer-service communication: corporate chunks and support roleplay."
    };

    startForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var email = emailField.value.trim();

      if (email.indexOf("@") < 1 || email.indexOf(".") < 3) {
        formNote.textContent = "Enter a valid email address to build your study plan.";
        formNote.className = "form-note";
        emailField.focus();
        return;
      }

      formNote.textContent = "Plan ready \u2014 " + plans[goalField.value];
      formNote.className = "form-note is-confirmed";
    });
  }


  /* =======================================================
     02. FLASHCARD DECK
     Cards stay in the queue until marked as known.
     ======================================================= */

  var deck = [
    {
      category: "Shipping chunk",
      label: "Customer service",
      front: "\u201CLet me look into that for you.\u201D",
      back: "Use this chunk when you need to investigate a customer\u2019s request or shipment status."
    },
    {
      category: "Tracking",
      label: "Shipment status",
      front: "\u201CYour package is currently in transit.\u201D",
      back: "Standard update when the shipment has left the origin facility but has not reached the delivery hub."
    },
    {
      category: "Customs",
      label: "Clearance",
      front: "\u201CThe shipment is being held for customs clearance.\u201D",
      back: "Use it to explain a delay caused by import duties or missing documentation."
    },
    {
      category: "Claims",
      label: "Problem resolution",
      front: "\u201CI\u2019ll open a claim for the damaged package.\u201D",
      back: "Formal action when the customer reports damage or a missing item on delivery."
    },
    {
      category: "Grammar C1",
      label: "Inversion",
      front: "\u201CHad we received the documents earlier, the parcel would have cleared customs.\u201D",
      back: "Inverted third conditional: formal alternative to \u201CIf we had received\u2026\u201D."
    },
    {
      category: "Grammar C1",
      label: "Modal perfect",
      front: "\u201CThe delay must have been caused by the customs inspection.\u201D",
      back: "Modal perfect for deduction about a past event, common in TOEFL reading and speaking tasks."
    }
  ];

  var flashcard = document.getElementById("flashcard");

  if (flashcard) {
    var elCategory = document.getElementById("cardCategory");
    var elCounter = document.getElementById("cardCounter");
    var elLabel = document.getElementById("cardLabel");
    var elFront = document.getElementById("cardFront");
    var elBack = document.getElementById("cardBack");
    var btnReview = document.getElementById("reviewAgain");
    var btnKnow = document.getElementById("knowThis");

    var queue = [];
    var current = 0;

    function pad(number) {
      return number < 10 ? "0" + number : String(number);
    }

    function resetDeck() {
      queue = deck.slice();
      current = 0;
      btnReview.disabled = false;
      btnKnow.textContent = "I know this";
      renderCard();
    }

    function renderCard() {
      if (queue.length === 0) {
        elCategory.textContent = "Session complete";
        elCounter.textContent = pad(deck.length) + " / " + pad(deck.length);
        elLabel.textContent = "Active recall";
        elFront.textContent = "Deck finished.";
        elBack.textContent = "All " + deck.length + " chunks reviewed. Start again to reinforce retention.";
        btnReview.disabled = true;
        btnKnow.textContent = "Restart deck";
        return;
      }

      var card = queue[current];
      elCategory.textContent = card.category;
      elCounter.textContent = pad(deck.length - queue.length + 1) + " / " + pad(deck.length);
      elLabel.textContent = card.label;
      elFront.textContent = card.front;
      elBack.textContent = card.back;
    }

    btnKnow.addEventListener("click", function () {
      if (queue.length === 0) {
        resetDeck();
        return;
      }
      queue.splice(current, 1);
      if (current >= queue.length) {
        current = 0;
      }
      renderCard();
    });

    btnReview.addEventListener("click", function () {
      if (queue.length < 2) {
        return;
      }
      queue.push(queue.splice(current, 1)[0]);
      if (current >= queue.length) {
        current = 0;
      }
      renderCard();
    });

    resetDeck();
  }


  /* =======================================================
     03. CUSTOMER SERVICE ROLEPLAY
     Each option adds the agent line and the customer reply.
     ======================================================= */

  var conversation = document.getElementById("conversation");

  if (conversation) {
    var responsePrompt = document.getElementById("responsePrompt");
    var resetButton = document.getElementById("resetRoleplay");
    var responseButtons = document.querySelectorAll(".response-button");
    var initialConversation = conversation.innerHTML;

    var replies = {
      track: {
        agent: "I can see your shipment is in transit and currently at our regional hub. The updated delivery estimate is tomorrow before 6 p.m.",
        customer: "That\u2019s good to know. Will I get a notification before the driver arrives?"
      },
      escalate: {
        agent: "I\u2019m escalating your case to our logistics team so they can locate the parcel. You\u2019ll receive an update within 24 hours.",
        customer: "Thank you. Could you send me the case number by email?"
      },
      solution: {
        agent: "I can either arrange a redelivery for tomorrow or issue a full refund if you prefer. Which option works better for you?",
        customer: "Let\u2019s try the redelivery first, please."
      },
      clarify: {
        agent: "Just to make sure I have the right details, could you confirm the tracking number and the delivery address?",
        customer: "Of course. The tracking number is GT-4471-902 and the address is the one on the order."
      }
    };

    function addMessage(role, speaker, text) {
      var wrapper = document.createElement("div");
      wrapper.className = "message " + role;

      var label = document.createElement("p");
      label.className = "speaker";
      label.textContent = speaker;

      var body = document.createElement("p");
      body.textContent = text;

      wrapper.appendChild(label);
      wrapper.appendChild(body);
      conversation.appendChild(wrapper);
    }

    for (var i = 0; i < responseButtons.length; i++) {
      responseButtons[i].addEventListener("click", function () {
        var reply = replies[this.getAttribute("data-reply")];
        if (!reply) {
          return;
        }
        addMessage("agent", "Agent", reply.agent);
        addMessage("customer", "Customer", reply.customer);
        this.disabled = true;
        responsePrompt.textContent = "Choose another action to continue the scenario:";
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        conversation.innerHTML = initialConversation;
        responsePrompt.textContent = "Choose your next action:";
        for (var j = 0; j < responseButtons.length; j++) {
          responseButtons[j].disabled = false;
        }
      });
    }
  }


  /* =======================================================
     04. MOBILE NAVIGATION AUTO-CLOSE
     Closes the collapsed navbar after selecting a section.
     ======================================================= */

  if (window.jQuery) {
    jQuery(".navbar-nav a").on("click", function () {
      if (jQuery(".navbar-toggler").is(":visible")) {
        jQuery("#mainNavigation").collapse("hide");
      }
    });
  }

})();
