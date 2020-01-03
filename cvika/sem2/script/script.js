$(document).ready(function () {


    let emails = [];


    // přidá email do pole emails
    function addEmail() {
        let email = {};
        email.reciver = $("#receiver").val();
        email.subject = $("#subject").val();
        email.message = $("#text").val();
        emails.push(email);

    }


    //přídá HTML div emailu do #savedEmails
    function addEmailElement() {

        let email = $("<div/>")
            .attr("id", "emailElement" + (emails.length - 1).toString())
            .attr("class", "emailElement")
            .html("<table>" +
                "<tr>" +
                "<td>Příjemce: " + emails[emails.length - 1].reciver + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Předmět: " + emails[emails.length - 1].subject + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Text: " + emails[emails.length - 1].message + "</td>" +
                "</tr>" +
                "</table>");
        let deleteEmail = $("<a/>")
            .attr("class", "deleteEmail")
            .attr("href", "#")
            .html("Smazat tento email.")
            .click(function () {
                event.preventDefault();
                let selectedEmail = this.parentNode.getAttribute("id").replace("emailElement", "");

                emails.splice(selectedEmail, 1);
                writeSuccessMessage("Email úspěšne vymázan z řady.");

                console.info(selectedEmail + " smazan a delka " + emails.length);
                $(this).closest("div").remove();
            });
        email.append(deleteEmail);
        $("#savedEmails").append(email);

    }

    //smaže všechny emaily v poli emails a všechny HTML elementy v savedEmails
    function deleteAllEmails() {
        $("#savedEmails").empty();
        emails.splice(0, emails.length);

    }

    // pošle JSON z pole emails na server
    function sendEmails() {
        var request = $.ajax({
            url: "http://localhost:8081/sendEmail",
            type: "POST",
            data: JSON.stringify(emails),
            contentType: "application/json"
        });
        request.done(function () {
            alert("Data poslána.");
        });
        request.fail(function () {
            alert("Nepodařilo se poslat data. Server neni dostupný nebo odmítl spojení.");
        });
        deleteAllEmails();
    }

    // kliknutí na tlačítko odeslat emaily
    $("#send").click(function () {
        event.preventDefault();
        cleanErrorSuccessText();
        if (checkSendEmail()) {
            sendEmails();
            deleteAllEmails();
            writeSuccessMessage("Email byl odeslán.");
        } else {
            writeErrorMessage("Nejste připojeni k internetu nebo nemáte k odeslání žádné Emaily.");
        }
       deleteAllInputs();
    });

    // kliknutí na tlačítko Přidat email
    $("#addEmailToQueue").click(function () {
        event.preventDefault();
        cleanErrorSuccessText();
        if (checkEmailText()) {
            addEmail();
            addEmailElement();
            writeSuccessMessage("Email přidán do fronty.");
            //console.info(emails[emails.length-1].reciver);
        }
        deleteAllInputs();
    });


    // proveří inputy pro email
    function checkEmailText() {

        let reciver = $("#receiver");
        let text = $("#text");

        const pattern = /^[a-zA-Z1-9]*@\w*.[a-zA-Z]{2,3}$/;
        const pattern2 = /\w/g;


        if (reciver.val().match(pattern)) {
            if (text.val().match(pattern2)) {
                return true;
            } else {
                text.focus();
                writeErrorMessage("Nemůžete odeslat prázdnou zprávu.");
                return false;
            }

        } else {
            reciver.focus();
            writeErrorMessage("Špatně zapsaný email.");
            return false;
        }


    }


    // oveří jeslti je v poli emails neco a jestli je stránka online
    function checkSendEmail() {
        cleanErrorSuccessText();
        if (navigator.onLine && emails.length !== 0) {
            return true;
        } else {
            return false;
        }
    }


    // error zpráva
    function writeErrorMessage(text) {
        $("#error-message").show().text(text);
    }


    // uspěšná správa
    function writeSuccessMessage(text) {
        $("#success-message").show().text(text);
    }


    // smazat zprávy
    function cleanErrorSuccessText() {
        $("#error-message").hide();
        $("#success-message").hide();
    }

    // smaže text všech inputů
    function deleteAllInputs() {
        $("#receiver").val("");
        $("#subject").val("");
        $("#text").val("");
    }
});
