let Pozivi = (function(){

    function dobaviZauzecaImpl(){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var parsiraniOdgovor = JSON.parse( ajax.responseText );
                Kalendar.ucitajPodatke( parsiraniOdgovor.periodicna, parsiraniOdgovor.vanredna );
                Kalendar.iscrtajKalendar(document.getElementById("kalendar"),trenutniMjesec);
            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("GET", "zauzeca", true);
        ajax.send();
    }

    function rezervisiTerminImpl(odabranaSala, pocetakInput, krajInput, odabraniDatum, checkboxVrijednost){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var odgovor = JSON.parse(ajax.responseText);
                if( odgovor.alertPoruka )
                    alert( odgovor.alertPoruka );
                Kalendar.ucitajPodatke( odgovor.periodicna, odgovor.vanredna );
                Kalendar.iscrtajKalendar( document.getElementById("kalendar"), trenutniMjesec );
                Kalendar.obojiZauzeca( document.getElementById("kalendar"),trenutniMjesec, odabranaSala,pocetakInput,krajInput );

            }
            if (ajax.readyState == 4 && ajax.status == 404)
                alert("Error");
        }
        ajax.open("POST", "rezervacije", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        var JohnDoe = "John Doe";
        var trenutniSemestar = "raspust";
        var parsiraniDatum = odabraniDatum.split(".");
        var dan = parsiraniDatum[0], mjesec = parsiraniDatum[1], godina = parsiraniDatum[2];
        var danUSedmici = (new Date(godina,mjesec-1,dan)).getDay();
        if( danUSedmici == 0 ) danUSedmici += 7;
        danUSedmici--;
        if( (trenutniMjesec >= 10 && trenutniMjesec <= 12) || trenutniMjesec == 1 ) trenutniSemestar = "zimski";
        if( trenutniMjesec >= 2 && trenutniMjesec <= 6 ) trenutniSemestar = "ljetnji";
        if( checkboxVrijednost ) ajax.send( JSON.stringify({
            dan: danUSedmici,
            semestar: trenutniSemestar,
            pocetak: pocetakInput,
            kraj: krajInput,
            naziv: odabranaSala,
            predavac: JohnDoe,
            checkboxChecked: checkboxVrijednost
        }) );
            else ajax.send( JSON.stringify({
                datum: odabraniDatum,
                pocetak: pocetakInput,
                kraj: krajInput,
                naziv: odabranaSala,
                predavac: JohnDoe,
                checkboxChecked: checkboxVrijednost
            }) );

        }

        function inicijalizirajPocetnuSlikamaImpl(){
            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200){
                    var sveDohvaceneSlike = JSON.parse(ajax.responseText);   
                    var prvaSlika = document.getElementById("prvaSlika");
                    var drugaSlika = document.getElementById("drugaSlika");
                    var trecaSlika = document.getElementById("trecaSlika"); 
                    prvaSlika.alt = ""; drugaSlika.alt = ""; trecaSlika.alt = "";
                    prvaSlika.src = "#"; drugaSlika.src = "#"; trecaSlika.src = "#";
                    if( sveDohvaceneSlike.slike.length < 4 ) document.getElementById("dalje").disabled = true;
                    if( sveDohvaceneSlike.slike.length > 0 ) prvaSlika.src = "http://localhost:8080/" + sveDohvaceneSlike.slike[0];
                    if( sveDohvaceneSlike.slike.length > 1 )  drugaSlika.src = "http://localhost:8080/" + sveDohvaceneSlike.slike[1];     
                    if( sveDohvaceneSlike.slike.length > 2  )  trecaSlika.src = "http://localhost:8080/" + sveDohvaceneSlike.slike[2];                   
                }
                if (ajax.readyState == 4 && ajax.status == 404)
                    alert("Error");
            }
            ajax.open("GET", "inicijalneSlike", true);
            ajax.send();
        }

        function izmjenaSlikaImpl(jesteDalje){
            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200){
                    var vraceniInfo = JSON.parse(ajax.responseText);   
                    var prvaSlika = document.getElementById("prvaSlika");
                    var drugaSlika = document.getElementById("drugaSlika");
                    var trecaSlika = document.getElementById("trecaSlika"); 
                    prvaSlika.alt = ""; drugaSlika.alt = ""; trecaSlika.alt = "";
                    prvaSlika.src = "#"; drugaSlika.src = "#"; trecaSlika.src = "#";
                    if( vraceniInfo.disableDalje == 'DA' ) document.getElementById("dalje").disabled = true;
                    else document.getElementById("dalje").disabled = false;
                    if( vraceniInfo.disableNazad == 'DA' ) document.getElementById("nazad").disabled = true;
                    else document.getElementById("nazad").disabled = false;
                    if( vraceniInfo.slike.length > 0 ) prvaSlika.src = "http://localhost:8080/" + vraceniInfo.slike[0];
                    if( vraceniInfo.slike.length > 1 )  drugaSlika.src = "http://localhost:8080/" + vraceniInfo.slike[1];     
                    if( vraceniInfo.slike.length > 2  )  trecaSlika.src = "http://localhost:8080/" + vraceniInfo.slike[2];                   
                }

                if (ajax.readyState == 4 && ajax.status == 404)
                    alert("Error");
            }
            var imgJedan = document.getElementById("prvaSlika").src.split("/");
            var prviZahtjev = imgJedan[imgJedan.length - 1];
            var imgDva = document.getElementById("drugaSlika").src.split("/");
            var drugiZahtjev = imgDva[imgDva.length - 1];
            var imgTri = document.getElementById("trecaSlika").src.split("/");
            var treciZahtjev = imgTri[imgTri.length - 1];
            ajax.open("GET", "izmjenaSlika?prva=" + prviZahtjev + "&treca=" + treciZahtjev + "&jesteDalje=" + jesteDalje, true);
            ajax.send();
        }

        return {
            dobaviZauzeca: dobaviZauzecaImpl,
            rezervisiTermin: rezervisiTerminImpl,
            inicijalizirajPocetnuSlikama: inicijalizirajPocetnuSlikamaImpl,
            izmjenaSlika: izmjenaSlikaImpl
        }
    }());

