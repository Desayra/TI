
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};


window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;



if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

function init(){
    showUsername();
    
    var request = window.indexedDB.open("MyTestDatabase", 3);
   
    request.onerror = function(event) {
 
        alert("Error");
    };
    request.onsuccess = function(event) {
        
        db = event.target.result;

       
        db.onerror = function(event) {
            console.log(event.srcElement.error)
            if(event.srcElement.error !== null){
                alert(event.srcElement.error)
            }else{
                alert("Database error: " + event.target.errorCode);

            }
        };

    };

   
    request.onupgradeneeded = function(event) {
        // Save the IDBDatabase interface
        var db = event.target.result;

      
        var objectStore = db.createObjectStore("books", { keyPath: "isbn" });

    
        objectStore.createIndex("name", "name", {unique:false});

    
        objectStore.createIndex("author", "author", {unique:false});

     
        objectStore.createIndex("year", "year", {unique:false});

        objectStore.transaction.oncomplete = function(event) {

        }


        //Datos para el usuario
        var userStore = db.createObjectStore("users", { keyPath: "uname" });
        userStore.createIndex("uemail", "uemail", {unique:false});
        userStore.createIndex("upwd", "upwd", {unique:false});
        userStore.transaction.oncomplete = function(event) {
        }

        //Datos para las solicitudes
        var reqStore = db.createObjectStore("requests", { keyPath: "rtitle" });
        reqStore.createIndex("rarea", "rarea", {unique:false});
        reqStore.createIndex("rdesc", "rdesc", {unique:false});
        reqStore.createIndex("rfecha", "rfecha", {unique:false});
        reqStore.createIndex("ruser", "ruser", {unique:false});
        reqStore.transaction.oncomplete = function(event) {
        }

        //Datos para las encuestas
        var encStore = db.createObjectStore("encuestas", { keyPath: "euser" });
        encStore.createIndex("eservicio", "eservicio", {unique:false});
        encStore.createIndex("earea", "earea", {unique:false});
        encStore.createIndex("eciudad", "eciudad", {unique:false});
        encStore.createIndex("ecomentario", "ecomentario", {unique:false});
        encStore.createIndex("efecha", "efecha", {unique:false});
        encStore.transaction.oncomplete = function(event) {
        }
    };

    // FUNCIONES PARA ENCUESTAS
    if(document.getElementById('addEncuesta') !== null){
        document.getElementById('addEncuesta').onclick = function(e) {

            // PARA LA FECHA
            const tiempo = Date.now();
            const hoy = new Date(tiempo);

            var eservicio = document.getElementById('encServicio').value;
            var earea = document.getElementById('encArea').value;
            var ecomentario = document.getElementById('encComentario').value;
            var efecha = hoy.toLocaleDateString();
            const encObject = {
                euser: sessionStorage.getItem("loggedUser"),
                eservicio: eservicio,
                earea: earea,
                ecomentario: ecomentario,
                efecha: efecha
            }

            var transaction = db.transaction(["encuestas"], "readwrite");

            transaction.oncomplete = function(event) {
                console.log("Exitoso");
            };

            transaction.onerror = function(event){
                console.dir(event);
            };

            var encsObjectStore = transaction.objectStore("encuestas");
            var request = encsObjectStore.add(encObject);

            request.onsuccess = function(event){
                alert('Registrado');
            };

            // aqui deberiamos redireccionar
            // updateRequestsTable();

        };
    }

    function updateEncuestasTable(){

        document.getElementById("encs-table-body").innerHTML = "";

        var request = db.transaction("encuestas").objectStore("encuestas").openCursor();

        request.onerror = function(event){
            console.dir(event);
        };

        request.onsuccess = function(event){

            cursor = event.target.result;

            if(cursor) {
                //Si el usuario es admin vera toda la informacion, caso contrario solo la de el
                    document.getElementById("encs-table-body").innerHTML += "<tr><td>" + cursor.value.euser + "</td><td>"
                        + cursor.value.eservicio + "</td><td>" + cursor.value.earea + "</td><td>"+ cursor.value.ecomentario + "</td><td>" + cursor.value.efecha + "</td></tr>";


                cursor.continue();
            }
        };
    }
    // FUNCIONES PARA SOLICITUDES O COTIZACIONES
    if(document.getElementById('addRequestButton') !== null){
        document.getElementById('addRequestButton').onclick = function(e) {

            // PARA LA FECHA
            const tiempo = Date.now();
            const hoy = new Date(tiempo);

            var title = document.getElementById('titleReq').value;
            var area = document.getElementById('areaReq').value;
            var desc = document.getElementById('descReq').value;
            var fecha = hoy.toLocaleDateString();
            var usuario = sessionStorage.getItem("loggedUser")
            const reqObject = {
                rtitle: title,
                rarea: area,
                rdesc: desc,
                rfecha: fecha,
                ruser: usuario
            }

            var transaction = db.transaction(["requests"], "readwrite");

            transaction.oncomplete = function(event) {
                console.log("all done with transaction");
            };

            transaction.onerror = function(event){
                console.dir(event);
            };

            var requestsObjectStore = transaction.objectStore("requests");
            var request = requestsObjectStore.add(reqObject);

            request.onsuccess = function(event){
                alert('Enviado');
            };

            updateRequestsTable();

        };
    }

    function updateRequestsTable(){

        document.getElementById("reqs-table-body").innerHTML = "";

        var request = db.transaction("requests").objectStore("requests").openCursor();

        request.onerror = function(event){
            console.dir(event);
        };

        request.onsuccess = function(event){

            cursor = event.target.result;

            if(cursor) {
                //Si el usuario es admin vera toda la informacion, caso contrario solo la de el
                    document.getElementById("reqs-table-body").innerHTML += "<tr><td>" + cursor.value.ruser + "</td><td>"
                        + cursor.value.rtitle + "</td><td>" + cursor.value.rarea + "</td><td>" + cursor.value.rdesc + "</td><td>" + cursor.value.rfecha + "</td></tr>";

                cursor.continue();
            }
        };
    }

    // TABLA DE USUARIOS
    function updateUsersTable(){

        document.getElementById("users-table-body").innerHTML = "";

        var request = db.transaction("users").objectStore("users").openCursor();

        request.onerror = function(event){
            console.dir(event);
        };

        request.onsuccess = function(event){

            cursor = event.target.result;
            var nivel = '';
            if(cursor) {

                if(cursor.value.univel == 'A'){
                    nivel = 'Administrador';
                }else{
                    nivel = 'Usuario Basico'
                }
                //Si soy el administrador se arma, caso contrario no
                
                    document.getElementById("users-table-body").innerHTML += "<tr><td>" + cursor.value.uname + "</td><td>"
                        + cursor.value.uemail + "</td><td>";
                
                cursor.continue();
            }
        };
    }


// book
    if(document.getElementById('addButton') !== null){
        document.getElementById('addButton').onclick = function(e) {

            var bname = document.getElementById('nameInput').value;
            var bauthor = document.getElementById('authorInput').value;
            var byear = document.getElementById('yearInput').value;
            var bisbn = document.getElementById('isbnInput').value;

            const book_item = {
                name: bname,
                author: bauthor,
                year: byear,
                isbn: bisbn
            }

            var transaction = db.transaction(["books"], "readwrite");

            transaction.oncomplete = function(event) {
                console.log("all done with transaction");
            };

            transaction.onerror = function(event){
                console.dir(event);
            };

            var booksObjectStore = transaction.objectStore("books");
            var request = booksObjectStore.add(book_item);

            request.onsuccess = function(event){
                console.log("added item");
            };

            updatetable();

        };
    }


    if(document.getElementById('delButton') !== null){
        document.getElementById('delButton').onclick = function(e){

            var isbn_del = document.getElementById('isbnDelInput').value;

            var request = db.transaction(["books"], "readwrite").objectStore("books").delete(isbn_del);

            request.onsuccess = function(event){
                console.log(isbn_del+" deleted");
            };

            updatetable();
        };
    }

    function updatetable(){

        document.getElementById("books-table-body").innerHTML = "";

        var request = db.transaction("books").objectStore("books").openCursor();

        request.onerror = function(event){
            console.dir(event);
        };

        request.onsuccess = function(event){

            cursor = event.target.result;

            if(cursor) {
                document.getElementById("books-table-body").innerHTML += "<tr><td>" + cursor.value.name + "</td><td>"
                    + cursor.value.author + "</td><td>" + cursor.value.year + "</td><td>" + cursor.key + "</td></tr>";

                cursor.continue();
            }
        };
    }

    // LOGIN
    document.getElementById('loginButton').onclick = function(e) {
        var uname = document.getElementById('uname').value;
        var pwd = document.getElementById('pwd').value;


        const userItem = {
            uname: uname,
            pwd: pwd
        }

        var userFound = db.transaction(["users"], "readwrite").objectStore("users").get(uname);

        setTimeout(() => {
            console.log("1 Segundo esperado")
            console.log(userFound.result)

            if(userFound.result) { // Si el nombre de usuario existe
                console.log('si')
                if(pwd !== userFound.result.upwd){
                    alert('Contrasena incorrecta')
                } else {
                    sessionStorage.setItem("loggedUser", userFound.result.uname);
                    sessionStorage.setItem("loggedEmail", userFound.result.uemail);
                    sessionStorage.setItem("loggedNivel", userFound.result.univel);
                    showUsername();
                    if(sessionStorage.getItem("loggedNivel") == 'A'){
                        window.location.href = "aservicio.html";
                    } else{
                        window.location.href = "servicio.html";
                    }
                }
            } else {
                alert('Incorreto. No existe')
            }
            // LIMPIAMOS LOS INPUTS
            document.getElementById('uname').value = '';
            document.getElementById('pwd').value = '';
        }, 1000);


    };

   
    if(document.getElementById('signup_button')){
        document.getElementById('signup_button').onclick = function(e) {
            var name = document.getElementById('su_name').value;
            var email = document.getElementById('su_email').value;
            var pwd = document.getElementById('su_pwd').value;
            var pwdr = document.getElementById('su_pwdr').value;

            if(pwd === pwdr){
                var nivel = 'U';
                if(name === '') {
                    nivel = 'A';
                }

                const userItem = {
                    uname: name,
                    uemail: email,
                    upwd: pwd,
                    univel: nivel
                }

                var transaction = db.transaction(["users"], "readwrite");

                transaction.oncomplete = function(event) {
                    console.log("Usuario completado");
                };

                transaction.onerror = function(event){
                    console.dir(event);
                };


                var userObjectStore = transaction.objectStore("users");
                var request = userObjectStore.add(userItem);

                request.onsuccess = function(event){
                    alert('Registrado');
                    // UNA VEZ CREADO EL USUARIO, GUARDAMOS SU DATO PARA SABER QUE ESTA LOGGEADO
                    sessionStorage.setItem("loggedUser", name);
                    sessionStorage.setItem("loggedEmail", email);
                    sessionStorage.setItem("loggedNivel", nivel);


                };


            }else{
                //ERROR DE CONTRASENA
                alert('Incorrecto.Las contrasenas no coinciden')
            }



        };
    }

    function showUsername(){
        // console.log('hola')
        // console.log(sessionStorage.getItem("loggedUser"))
        if (sessionStorage.getItem("loggedUser")){
            // si hay usuario, mostramos su nombre y ocultamos el formulario
            document.getElementById("login_form").style.display = "none";
            document.getElementById("logged_name").style.display = "block";
            // document.getElementById("mostrar_usuario").innerHTML = '<a id="logout" class="logout" href="#logout">' + sessionStorage.getItem("loggedUser") + '</a>';
            document.getElementById("logout").innerHTML = sessionStorage.getItem("loggedUser");
        }else{
            // si no hay usuario, ocultamos el nombre del usuario y mostramos el form
            document.getElementById("login_form").style.display = "block";
            document.getElementById("logged_name").style.display = "none";
        }
    }

    document.getElementById('logout').onclick = function(e) {
        logout();
    };

    function logout(){
        if (sessionStorage.getItem("loggedUser")){
            sessionStorage.removeItem("loggedUser");
            // Ocultamos el nombre del usuario que ya no existe y mostramos el formulario
            document.getElementById("login_form").style.display = "block";
            document.getElementById("logged_name").style.display = "none";
        }
        window.location.href = "index.html";
    }

    // CARGA DE DATOS AL ENTRAR A LA PAGINA
    setTimeout(() => {
        // console.log("Cargando datos de la tabla")
        if(document.getElementById('reqs-table-body')){
            updateRequestsTable();
        }
        if(document.getElementById('users-table-body')){
            updateUsersTable();
        }
        if(document.getElementById('encs-table-body')){
            updateEncuestasTable();
        }

        if(sessionStorage.getItem("loggedUser")){
            [].forEach.call(document.querySelectorAll('.registrarLink'), function (el) {
                el.style.visibility = 'hidden';
            });
            // document.getElementsByClassName("login_form").style.display = "none";
        }

    }, 100);
}
