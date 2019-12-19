$(document).ready(function () {
    $("#button").click(function () {
        var poznamkaText = prompt("Zadejte poznamky");
        var pocetPoznamek = 0;
        var poznamka = $("<div></div>");
        poznamka.text(poznamkaText);
        poznamka.css({"cursor": "pointer"});
        poznamka.click(function () {
            if (confirm("chcete tuto poznamku smazat?")) {
                $(this).remove();
            }

        });

        $("#notes").append(poznamka);
        pocetPoznamek++;
    })
});

