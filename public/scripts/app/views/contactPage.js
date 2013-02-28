// The backbone router
define([
    'underscore',
    'jquery',
    'backbone',
    'text!app/templates/contact.html'
],
    function(
        _,
        $,
        Backbone,
        Template) {

        var publics = {};

        publics.ContactView = Backbone.View.extend({

            events: {
                'click #btnSubmit': 'submitForm'
            },

            submitForm: function(e){
                this.$el.find("#inputName").parent().parent().toggleClass("error", this.$el.find("#inputName").val().length === 0);
                this.$el.find("#inputEmail").parent().parent().toggleClass("error", !this.validateEmail(this.$el.find("#inputEmail").val()));
                this.$el.find("#inputPhone").parent().parent().toggleClass("error", this.$el.find("#inputPhone").val().length === 0);
                this.$el.find("#inputMessage").parent().parent().toggleClass("error", this.$el.find("#inputMessage").val().length === 0);

                if (this.$el.find("div.well-large div.error").length === 0){
                    $.post("/email", {
                        name: this.$el.find("#inputName").val(),
                        email: this.$el.find("#inputEmail").val(),
                        phone: this.$el.find("#inputPhone").val(),
                        message: this.$el.find("#inputMessage").val(),
                        type: this.$el.find("#messageType").val(),
                        subject: "Contact Form"
                    });

                    this.$el.find(":input").val("");
                }
            },

            validateEmail: function(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },

            initialize: function(options){
                this.messageType = options.messageType;
            },

            render: function(){
                this.$el.html(Template);
                this.$("#messageType").val(this.messageType);
            }
        });

        return publics.ContactView;
    });