$(document).ready(function() {
  $.validator.addMethod(
      "regex",
      function(value, element, regexp) {
          var re = new RegExp(regexp);
          return this.optional(element) || re.test(value);
      },
      "Check your input."
  );

  $(".switch.menu .item").click(function(e) {
    var target = $(e.currentTarget);
    var type = target.data("type");

    if (type === "create") {
      $("#loginForm").hide();
      $("#createForm").show();
      $(".switch.menu .item").removeClass("active");
      target.addClass("active");
    } else {
      $("#createForm").hide();
      $("#loginForm").show();
      $(".switch.menu .item").removeClass("active");
      target.addClass("active");
    }
    navigator.vibrate(10);
  });

  $("#createForm").validate({
    onkeyup: false,
    rules: {
      username: {
        required: true,
        minlength: 3,
        remote: {
          url: "/api/checkname",
          data: {
            format: "boolean"
          }
        }
      },
      password: "required",
      confirmpass: {
        equalTo: "#create-password",
        required: true
      },
      email: "email",
    },
    messages: {
        username: {
          required: "This field is required",
          minlength: "Your username needs to be at least 3 characters",
          maxlength: "Your username needs to be less than 18 characters",
          remote: "You can't use this name, try another one."
        }
      }
  });

  $("#loginForm").validate({
    rules: {
      username: {
        required: true,
        minlength: 3,
        maxlength: 18
      },
      password: "required"
    }
  });

  $("#login-username").rules("add", { regex: "^[a-zA-Z]+$", messages: {regex: "Only letters allowed, no spaces or numbers"} });
  $("#create-username").rules("add", { regex: "^[a-zA-Z]+$", messages: {regex: "Only letters allowed, no spaces or numbers"} });

  $("#create-password").rules("add", { regex: "^[a-zA-Z0-9]+$", messages: {regex: "Only letters and numbers allowed, no spaces"} });

  $("input[type='radio'][name='run']").change(function(e) {
    var target = $(e.currentTarget);
    var value = target.val();
    var form = target.closest("form");
    if (value === "umbra") form.attr("action", "http://umbra.avalon-rpg.com");
    //- if (value == "umbra") form.attr("action", "http://localhost:2252");
    if (value === "applet") form.attr("action", "/javalon/");
    if (value === "lumiere") form.attr("action", "/lumiere/");
    navigator.vibrate(10);
  });
});