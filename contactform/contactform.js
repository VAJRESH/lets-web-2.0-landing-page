jQuery(document).ready(function ($) {
  "use strict";

  //Contact
  $("form.contactForm").submit(function () {
    $("#sendmessage").addClass("show");
    $("#sendmessage").html("Sending the email....");

    var f = $(this).find(".form-group"),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children("input").each(function () {
      // run all inputs

      var i = $(this); // current input
      var rule = i.attr("data-rule");

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(":", 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case "required":
            if (i.val() === "") {
              ferror = ierror = true;
            }
            break;

          case "minlen":
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case "email":
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case "checked":
            if (!i.is(":checked")) {
              ferror = ierror = true;
            }
            break;

          case "regexp":
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next(".validation")
          .html(
            ierror
              ? i.attr("data-msg") !== undefined
                ? i.attr("data-msg")
                : "wrong Input"
              : "",
          )
          .show("blind");
      }
    });
    f.children("textarea").each(function () {
      // run all inputs

      var i = $(this); // current input
      var rule = i.attr("data-rule");

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(":", 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case "required":
            if (i.val() === "") {
              ferror = ierror = true;
            }
            break;

          case "minlen":
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next(".validation")
          .html(
            ierror
              ? i.attr("data-msg") != undefined
                ? i.attr("data-msg")
                : "wrong Input"
              : "",
          )
          .show("blind");
      }
    });
    if (ferror) return false;
    else var str = $(this).serialize();

    // get user data to send
    const senderName = this[0].value;
    const senderEmail = this[1].value;
    const senderSubject = this[2].value;
    const senderMessage = this[3].value;

    const data = {
      name: senderName,
      email: senderEmail,
      subject: senderSubject,
      message: senderMessage,
    };

    // send email
    fetch("/.netlify/functions/send-emails", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
    }).then((res) => {
      setTimeout(() => {
        $("#errormessage").removeClass("show");
        $("#sendmessage").removeClass("show");
      }, 3000);

      // in case the email was not send
      if (res.status !== 200) {
        $("#sendmessage").removeClass("show");
        $("#errormessage").addClass("show");
        return $("#errormessage").html(
          "Something went wrong. Please try again.",
        );
      }

      $("#sendmessage").addClass("show");
      $("#sendmessage").html("Your message has been sent. Thank you!");
      $("#errormessage").removeClass("show");
      $(".contactForm").find("input, textarea").val("");
      // clear the form
      $(this[0]).val("");
      $(this[1]).val("");
      $(this[2]).val("");
      $(this[3]).val("");
    });

    return false;
  });
});
