const SUPABASE_URL = "https://ucaakufjfkdqwcryamee.supabase.co"
const SUPABASE_KEY = "sb_publishable_wjBHSBRbVoK5imsfyvr2CA_913EwygH"

var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)



// LOGIN
async function login(){

let usuario = document.getElementById("usuario").value
let password = document.getElementById("password").value

const { data, error } = await supabase
.from("usuarios")
.select("*")
.eq("usuario",usuario)
.eq("password",password)

if(data && data.length > 0){

localStorage.setItem("id_cliente", data[0].id_cliente)
localStorage.setItem("rol", data[0].rol)

if(data[0].rol === "cliente"){
window.location.href = "dashboard_cliente.html"
}

if(data[0].rol === "colaborador"){
window.location.href = "dashboard_colaborador.html"
}

}else{

alert("Usuario o contraseña incorrectos")

}

}



// VER CUENTAS
async function verCuentas(){

let id_cliente = localStorage.getItem("id_cliente")

const { data, error } = await supabase
.from("cuentas")
.select("*")
.eq("id_cliente",id_cliente)

let html = `
<h3>Mis Cuentas</h3>

<table>

<tr>
<th>ID</th>
<th>Tipo</th>
<th>Saldo</th>
</tr>
`

data.forEach(cuenta => {

html += `
<tr>
<td>${cuenta.id_cuenta}</td>
<td>${cuenta.tipo_cuenta}</td>
<td>Q ${cuenta.saldo}</td>
</tr>
`

})

html += "</table>"

document.getElementById("resultado").innerHTML = html

}



// VER CREDITOS
async function verCreditos(){

let id_cliente = localStorage.getItem("id_cliente")

const { data, error } = await supabase
.from("creditos")
.select("*")
.eq("id_cliente",id_cliente)

let html = `
<h3>Mis Créditos</h3>

<table>

<tr>
<th>ID</th>
<th>Monto</th>
<th>Saldo Pendiente</th>
<th>Estado</th>
</tr>
`

data.forEach(credito => {

html += `
<tr>
<td>${credito.id_credito}</td>
<td>Q ${credito.monto}</td>
<td>Q ${credito.saldo_pendiente}</td>
<td>${credito.estado}</td>
</tr>
`

})

html += "</table>"

document.getElementById("resultado").innerHTML = html

}



// VER PAGOS
async function verPagos(){

let id_cliente = localStorage.getItem("id_cliente")

const { data, error } = await supabase
.from("pagos")
.select(`
monto_pago,
fecha_pago,
Creditos!inner(id_cliente)
`)
.eq("Creditos.id_cliente",id_cliente)

let html = "<h3>Historial de Pagos</h3>"

data.forEach(pago => {

html += `
<p>
Fecha: ${pago.fecha_pago}<br>
Monto: Q ${pago.monto_pago}
</p>
<hr>
`

})

document.getElementById("resultado").innerHTML = html

}



// SOLICITAR CREDITO
async function solicitarCredito(){

let monto = prompt("Ingrese el monto del crédito")
let plazo = prompt("Ingrese plazo en meses")

let id_cliente = localStorage.getItem("id_cliente")

await supabase
.from("creditos")
.insert([{
id_cliente:id_cliente,
monto:monto,
tasa_interes:5,
plazo_meses:plazo,
fecha_inicio:new Date(),
saldo_pendiente:monto,
estado:"Pendiente"
}])

alert("Solicitud enviada")

}



// ABRIR NUEVA CUENTA
async function abrirCuenta(){

let tipo = prompt("Tipo de cuenta (Ahorro o Monetaria)")

let id_cliente = localStorage.getItem("id_cliente")

await supabase
.from("cuentas")
.insert([{
id_cliente:id_cliente,
tipo_cuenta:tipo,
saldo:0,
fecha_apertura:new Date()
}])

alert("Cuenta solicitada")

}


// BUSCAR CLIENTE
async function buscarCliente(){

let id = document.getElementById("buscarCliente").value

const { data, error } = await supabase
.from("cuentas")
.select("*")
.eq("id_cliente",id)

let html = "<h3>Cuentas del cliente</h3>"

data.forEach(cuenta => {

html += `
<p>
Tipo: ${cuenta.tipo_cuenta}<br>
Saldo: Q ${cuenta.saldo}
</p>
<hr>
`

})

document.getElementById("resultado").innerHTML = html

}



// CERRAR SESION
function logout(){

localStorage.clear()

window.location.href = "index.html"

}
