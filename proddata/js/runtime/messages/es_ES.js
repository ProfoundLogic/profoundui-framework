//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2018 Profound Logic Software, Inc.
//
//  This file is part of the Profound UI Runtime
//
//  The Profound UI Runtime is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  The Profound UI Runtime is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

// ------------------------------------------------------------
//  Spanish / Spain
// -------------------------------------------------------------
var es_ES = function(dict) {

    var dictMsg = {};

    switch (dict) {

        case "runtimeMsg":
            dictMsg["closeMessage"]                 = "Esto cerrará su sesión.";
            dictMsg["no connection message"]        = "No es posible establecer ligación al servidor. Verifique la ligación y él intente de nuevo.";
            dictMsg["upload file limit"]            = "Límite de &1 archivo(s) excedido.";
            dictMsg["upload size limit"]            = "Límite de &1MB por archivo excedido";
            dictMsg["upload no files"]              = "No hay archivos seleccionados.";
            dictMsg["upload duplicate file"]        = "Archivos seleccionados en duplicado.";
            dictMsg["upload file exists"]           = "Uno o más archivos ya existen en lo sistema de archivos.";
            dictMsg["upload prevented"]             = "Operación embargada por 'exit program'.";
            dictMsg["upload input limit"]           = "El límite del tamaño total del 'input' fue excedido.";
            dictMsg["upload no session"]            = "No está conectado con una sesión válida.";
            dictMsg["upload timeout"]               = "El tiempo límite por la transacción fue excedido.";
            dictMsg["upload invalid response"]      = "No hay contestación del servidor o ella es inválida.";  //Also used in Atrium for Ajax error.
            dictMsg["upload cancelled"]             = "Carga cancelada.";
            dictMsg["close browser text"]           = "Para terminar el proceso de cierre de la sesión, por favor cierre el browser.";
            dictMsg["session ended text"]           = "Su sesión fue cerrada.";
            dictMsg["outside ucs2"]                 = 'Caracteres fuera de la gama UCS-2.';
            dictMsg["invalid number"]               = '&1 no es un numero válido.';
            dictMsg["invalid length"]               = '&1 tiene longitud o casas decimales incorrectos.';
            dictMsg["invalid decimal"]              = '&1 tiene excesivas casas decimales. (max: &2)';
            dictMsg["invalid choice"]               = '"&1" es inválido. Las opciones válidas son: "&2" ou "&3".';
            dictMsg["invalid date"]                 = '"&1" no es una fecha válida. Ejemplo del formato correcto: &2';
            dictMsg["invalid time"]                 = '"&1" no es un valor de tiempo correcto. Ejemplo del formato correcto: &2';
            dictMsg["invalid time stamp"]           = '"&1" no es un registro del tiempo válido. Ejemplo del formato correcto: &2';
            dictMsg["invalid percent"]              = '&1 no es un valor decimal.';
            dictMsg["invalid digits"]               = '"&1" contiene demasiado dígitos. Max: &2';
            dictMsg["exceeds whole"]                = '"&1" excede el número máximo de dígitos para la parte numérica del campo (&2 digits).';
            dictMsg["exceeds decimal"]              = '"&1" excede el número máximo de dígitos para la parte decimal del campo (&2 digits).';
            dictMsg["zip too long"]                 = 'El código postal es demasiado grande. (Máximo: &1 digits)';
            dictMsg["phone too long"]               = 'El número de teléfono es demasiado grande. (Máximo: &1 digits)';
            dictMsg["ssno too long"]                = 'El código de la Seguridad Social es demasiado grande. (Máximo: &1 digits)';
            dictMsg["invalid custom val"]           = 'Validación de función custom inválida.';
            dictMsg["error custom val"]             = 'Error en la validación de función costum.';
            dictMsg["ME"]                           = "Campo de entrada obligatorio. Usted debe incorporar datos.";
            dictMsg["MF"]                           = "Campo de introducción total obligatoria. Usted debe llenar la caja de entrada totalmente.";
            dictMsg["required"]                     = "El valor no puede estar en blanco. Se requiere este campo.";
            dictMsg["file required"]                = "Debe seleccionar al menos un archivo.";
            dictMsg["signature overflow"]           = "La imagen de la firma excede el número máximo de los bytes disponibles para su almacenaje. Por favor borre la caja de la firma e intente de nuevo.";
            dictMsg["validValues"]                  = "El valor introducido es inválido. Valores válidos son: ";
            dictMsg["upload invalid type"]          = "Uno o más archivos son de tipo inválido.";
            dictMsg["invalid email"]                = "Dirección de correo electrónico no es válida.";
            dictMsg["session timed out"]            = "El tiempo de su sesión ha expirado.";
            dictMsg["invalid low range"]            = "El valor debe ser mayor o igual a &1";
            dictMsg["invalid high range"]           = "El valor debe ser menor o igual a &1";
            dictMsg["invalid range"]                = "El valor debe estar comprendido entre &1 y &2";
            dictMsg["unmonitored exception"]        = "Este programa ha encontrado algunas excepciones no monitorieadas. Favor contactar al administrador del sistema para su ayuda.";
            dictMsg["loading x"]                    = "Cargando &1...";
            dictMsg["data src not specfd x"]        = "Fuente de datos no especificada para &1...";
            dictMsg["name fld not specfd x"]        = "Nombre de campo no especificado para &1...";
            dictMsg["val fld not specfd x"]         = "Valor de campo no especificado para &1...";
            dictMsg["failed to load x"]             = "Carga fallida de &1.";
            dictMsg["cannot rmv last col"]          = "No se puede remover la ultima columna.";
            dictMsg["cannot find col"]              = "No se puede encontrar el id de columna especificado.";
            dictMsg["subfile deletion"]             = "Esta seguro que desea borrar el subarchivo ?";
            dictMsg["downloading x"]                = "Cargando &1";
            dictMsg["ie9 too low xlsxpics"]         = "Las imágenes no pueden ser exportadas usando IE9 o inferior.";

            // Atrium only.
            dictMsg["num sessions exceeded"]        = "Se excedió el numero de sesiones permitido.";
            dictMsg["unable to load portal"]        = "No es posible cargar la configuración del portal o los ítems de navegación.";
            dictMsg["unable to load macr act"]      = "No es posible cargar las acciones de macro.";
            dictMsg["unable to load macr var"]      = "No es posible cargar las variables de macro.";
            dictMsg["unable to load scrn lst"]      = "No es posible cargar la lista de pantallas.";
            dictMsg["unable to load new sett"]      = "No es posible cargar los nuevos parámetros de configuración.";
            dictMsg["unable to load x"]             = "No es posible cargar &1.";
            dictMsg["unable to add x"]              = "No es posible adicionar &1.";
            dictMsg["unable to rename x"]           = "No es posible renombrar &1.";
            dictMsg["unable to delete x"]           = "No es posible borrar &1.";
            dictMsg["unable to update x"]           = "No es posible actualizar &1.";
            dictMsg["unable to reassn x"]           = "No es posible reasignar &1.";
            dictMsg["unable to reorder items"]      = "No es posible reordenar ítems.";
            dictMsg["unable to save theme"]         = "No es posible salvar la configuración de tema.";
            dictMsg["unable eval script url"]       = "No es posible evaluar la URL de código de aplicación web.";
            dictMsg["close browser text AT"]        = "Los cambios no salvados en las sesiones se perderá.";
            dictMsg["close all tabs"]               = "Desea cerrar todas las pestañas ?";
            dictMsg["close tab"]                    = "Desea cerrar esta pestaña ?";
            dictMsg["invalid script url"]           = "Valor invalido para la URL de código de aplicación web.";
            dictMsg["unrecognized format"]          = "Formato no reconocido.";
            dictMsg["screen already defined"]       = "La pantalla \"&1\" ya esta definida.";
            dictMsg["macro already defined"]        = "La Macro \"&1\" ya esta definida.";
            dictMsg["no screen ids"]                = "No hay identificadores de pantalla para visualizar";
            dictMsg["confirm delete"]               = "Confirma borrado";
            dictMsg["no actions"]                   = "NO hay acciones para visualizar.";
            dictMsg["msg action input var"]         = "Ingrese el valor en la variable \"&1\" en el campo de la fila &2, columna &3.";
            dictMsg["msg action input user"]        = "Ingrese el perfil de usuario actual en el campo de la fila &1, columna &2.";
            dictMsg["msg action input js"]          = "Ingrese el resulta de la expresión de JavaScript <strong>&1</strong> en el campo de la fila &2, columna &3.";
            dictMsg["msg action input other"]       = "Ingrese el valor \"&1\" en el campo de la fila &2, columna &3.";
            dictMsg["msg presskey var"]             = "Presione la tecla definida en la variable \"&1\".";
            dictMsg["msg presskey other"]           = "Presione la tecla \"&1\".";
            dictMsg["msg del scrn from macro"]      = "Esta seguro que desea borrar la(s) pantalla(s) seleccionadas de esta macro ?<br /> Todas las acciones asociadas también serán borradas.";
            dictMsg["choose scrn macro"]            = "Seleccione una pantalla o macro para trabajar con sus propiedades.";
            dictMsg["choose a nav or toolbar"]      = "Seleccione un ítem de navegación o de la barra de herramientas para trabajar con sus propiedades.";
            dictMsg["confirm del sel x"]            = "Está seguro que desea borrar el &1 seleccionado ?";
            dictMsg["permission settings"]          = "Parámetros de configuración de permisos";
            dictMsg["adding x"]                     = "Adicionando &1...";
            dictMsg["deleting x"]                   = "Borrando &1 ...";
            dictMsg["reassigning x"]                = "Reasignando &1...";
            dictMsg["loading"]                      = "Cargando...";
            dictMsg["saving"]                       = "Salvando...";
            dictMsg["x added"]                      = "&1 adicionado.";
            dictMsg["x deleted"]                    = "&1 borrado.";
            dictMsg["x reassigned"]                 = "&1 reasignado.";
            dictMsg["x updated"]                    = "&1 actualizado.";
            dictMsg["x saved"]                      = "&1 salvado.";
            dictMsg["msg del group"]                = "Está seguro que desea borrar el grupo \"&1\" ?<br /><br />El borrar grupos tambienborra cualquier subgrupo y cualquier usuario asociado.<br /><br />Está seguro que desea continuar ?";
            dictMsg["conf reassign users 1"]        = "Está seguro que desea reasignar ";
            dictMsg["conf reassign users 2a"]       = "usuario \"&1\" ";
            dictMsg["conf reassign users 2b"]       = "los usuarios seleccionados ";
            dictMsg["conf reassign users 3"]        = " al grupo \"&1\" ?";
            dictMsg["conf reassign group"]          = "Está seguro que desea reasignar el grupo \"&1\" al grupo \"&2\" ?";
            dictMsg["conf delete users 1"]          = "Está seguro que desea borrar ";
            dictMsg["conf delete users 2a"]         = "usuario \"&1\" ?";
            dictMsg["conf delete users 2b"]         = "los usuarios seleccionados ?";
            dictMsg["no users"]                     = "No hay usuarios para visualizar.";
            dictMsg["cannot delete own grp"]        = "No puede borrar su propio grupo.";
            dictMsg["cannot delete own usr"]        = "No puede borra su propio perfil de usuario.";
            dictMsg["not auth reassign prf"]        = "No esta autorizado a reasignar su propio perfil.";
            dictMsg["typeselect macro name"]        = "Digite o seleccione el nombre de macro...";
            dictMsg["any child items will"]         = "Cualquier ítem hijo también será borrado.";
            dictMsg["password must be"]             = "Las contraseñas deben ser de al menos 6 caracteres.";
            dictMsg["type or sel home page"]        = "Digite o seleccione la página de inicio...";
            dictMsg["x is already in list"]         = "\"&1\" ya está en la lista.";
            dictMsg["x is not valid libname"]       = "\"&1\" no es un nombre de biblioteca valido.";
            dictMsg["no libraries in list"]         = "No hay bibliotecas en la lista";
            dictMsg["add libl entry"]               = "Adicionar entrada en la lista de bibliotecas";
            dictMsg["would you like add ano"]       = "Desearía adicionar otro ?";
            dictMsg["already in suppl grp x"]       = "El usuario ya está en un grupo suplementario \"&1\".";

            break;

        case "runtimeText":
            dictMsg["upload select text"]           = "Archivos Seleccionados";
            dictMsg["upload clear text"]            = "Borrar";
            dictMsg["upload remove text"]           = "Remover";
            dictMsg["upload upload text"]           = "Cargar";
            dictMsg["upload drophere text"]         = "Soltar los archivos aquí";
            dictMsg["upload browser unsupported"]   = "Arrastrar/soltar archivos requiere Internet Explorer 10 o superior, Chrome, o Firefox";
            dictMsg["upload finished text"]         = "Finalizado";
            dictMsg["excel export text"]            = "Exportar para Excel";    //Replaces "csv export text".
            dictMsg["export to x"]                  = "Exportar para &1";
            dictMsg["filter text"]                  = "Filtrar";
            dictMsg["find text"]                    = "Buscar";
            dictMsg["reset data"]                   = "Restablecer";
            dictMsg["remove filters text"]          = "Remover Todos os Filtros";
            dictMsg["displayed columns"]            = "Columnas visualizadas";
            dictMsg["next link text"]               = "Próximo";
            dictMsg["previous link text"]           = "Anterior";
            dictMsg["sort ascending text"]          = "Ordenación Ascendente";
            dictMsg["sort descending text"]         = "Ordenación Descendente";
            dictMsg["row"]                          = "línea";
            dictMsg["rows"]                         = "líneas";
            dictMsg["page"]                         = "Página";
            dictMsg["collapseAll"]                  = "Contraer todo";
            dictMsg["expandAll"]                    = "Expandir todo";
            dictMsg["user"]                         = "Usuario";
            dictMsg["password"]                     = "Contraseña";
            dictMsg["sign on"]                      = "Ingreso";
            dictMsg["pui"]                          = "Profound UI";
            dictMsg["pui sign on"]                  = dictMsg["pui"] + " " + dictMsg["sign on"];
            dictMsg["pjs"]                          = "Profound.js";
            dictMsg["pjs sign on"]                  = dictMsg["pjs"] + " " + dictMsg["sign on"];
            dictMsg["message id"]                   = "Identificacion de mensaje";
            dictMsg["ctlr job"]                     = "Trabajo Controlador";
            dictMsg["app job"]                      = "Trabajo de Aplicación";
            dictMsg["joblog download"]              = "Descargar pistas de auditoria del trabajo";
            dictMsg["curr user"]                    = "Usuario Actual";
            dictMsg["remote ip"]                    = "Dirección IP Remota";
            dictMsg["remote port"]                  = "Puerto Remoto";
            dictMsg["severity"]                     = "Severidad";
            dictMsg["date"]                         = "Fecha";
            dictMsg["time"]                         = "Hora";
            dictMsg["program"]                      = "Programa";
            dictMsg["procedure"]                    = "Procedimiento";
            dictMsg["lines"]                        = "Linea(s)";
            dictMsg["message"]                      = "Mensaje";
            dictMsg["new session"]                  = "Nueva sesión";
            dictMsg["close"]                        = "Cerrar";
            dictMsg["current password"]             = "Contraseña Actual";
            dictMsg["new password"]                 = "Nueva contraseña";
            dictMsg["repeat new password"]          = "Repetir nueva contraseña";
            dictMsg["submit"]                       = "Enviar";
            dictMsg["exit"]                         = "Salir";
            dictMsg["warning"]                      = "Advertencia";
            dictMsg["change password"]              = "Cambiar contraseña";
            dictMsg["cancel"]                       = "Cancelar";
            dictMsg["find text"]                    = "Encontrar";
            dictMsg["remove filter"]                = "Quitar filtro";
            dictMsg["chart"]                        = "Gráfico";
            dictMsg["section"]                      = "Sección";
            dictMsg["version"]                      = "Versión";
            dictMsg["fixPack"]                      = "Paquete de arreglos";
            // Atrium only.
            dictMsg["yes"]                          = "Si";
            dictMsg["no"]                           = "No";
            dictMsg["settings"]                     = "Ajustes";
            dictMsg["favorites"]                    = "Favoritos";
            dictMsg["type query press en"]          = "Digite la consulta, presione Enter.";
            dictMsg["add to favorites"]             = "Adicionar a Favoritos";
            dictMsg["rmv from favorites"]           = "Remover de Favoritos";
            dictMsg["please wait"]                  = "Por favor espere...";
            dictMsg["control panel"]                = "Panel de control";
            dictMsg["my settings"]                  = "Mis Ajustes";
            dictMsg["about atrium"]                 = "Sobre Atrium";
            dictMsg["about atrium msg"]             = dictMsg["version"] + " " + window["pui"]["baseVersion"] + ", " + dictMsg["fixPack"] + " " + window["pui"]["fixPackVersion"] + "<br /><br />"
                                                    + "Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
                                                    + "Warning: This computer program is protected by copyright law<br />"
                                                    + "and international treaties. Unauthorized reproduction or<br />"
                                                    + "distribution of this program, or any portion of it, may result in<br />"
                                                    + "severe civil and criminal penalties, and will be prosecuted to the<br />"
                                                    + "maximum extent possible under the law.<br /><br />"
                                                    + "Patented. &nbsp;U.S. Patent No. 8,667,405 B2.";
            dictMsg["item"]                         = "Ítem";
            dictMsg["open selected item"]           = "Abrir ítem seleccionado";
            dictMsg["of"]                           = "de";
            dictMsg["no results to dsp"]            = "No hay resultados a visualizar.";
            dictMsg["displaying results"]           = "Visualizando resultados";
            dictMsg["search results"]               = "Buscar resultados";
            dictMsg["new folder"]                   = "Nueva carpeta";
            dictMsg["rename"]                       = "Renombrar";
            dictMsg["description"]                  = "Descripción";
            dictMsg["ok"]                           = "OK";
            dictMsg["add"]                          = "Adicionar";
            dictMsg["add x"]                        = "Adicionar &1";
            dictMsg["delete"]                       = "Borrar";
            dictMsg["screen"]                       = "Pantalla";
            dictMsg["screens"]                      = "Pantallas";
            dictMsg["macro"]                        = "Macro";
            dictMsg["macros"]                       = "Macros";
            dictMsg["screen id"]                    = "Identificador de pantalla";
            dictMsg["screen ids"]                   = "Identificadores de pantalla";
            dictMsg["field row"]                    = "Campo de fila";
            dictMsg["field column"]                 = "Campo de columna";
            dictMsg["field value"]                  = "Campo de valor";
            dictMsg["value"]                        = "Valor";
            dictMsg["action"]                       = "Acción";
            dictMsg["actions"]                      = "Acciones";
            dictMsg["detect once"]                  = "Detectar una vez";
            dictMsg["delete screen"]                = "Borrar pantalla";
            dictMsg["genie macros"]                 = "Macros de Genie";
            dictMsg["screen name"]                  = "Nombre de pantalla";
            dictMsg["identifier"]                   = "Identificador";
            dictMsg["identifiers"]                  = "Identificadores";
            dictMsg["macro name"]                   = "Nombre de macro";
            dictMsg["close browser wintab"]         = "Cierre la ventana o pestaña del navegador.";
            dictMsg["select"]                       = "Seleccione";
            dictMsg["write value in field"]         = "Escriba el valor en un campo";
            dictMsg["press a key"]                  = "Presione una tecla";
            dictMsg["a literal value"]              = "Un valor literal";
            dictMsg["a variable value"]             = "Un valor de variable";
            dictMsg["cur user profile"]             = "El perfil de usuario actual";
            dictMsg["result js expr"]               = "El resultado de una expresión de JavaScript";
            dictMsg["action data"]                  = "Datos de acción";
            dictMsg["data type"]                    = "Tipo de datos";
            dictMsg["users"]                        = "Usuarios";
            dictMsg["all groups"]                   = "Todos los grupos";
            dictMsg["supplemental groups"]          = "Grupos suplementarios";
            dictMsg["users w primary grp"]          = "Usuarios cuyo Grupo Primario es \"&1\"";
            dictMsg["users w suppl grp"]            = "Usuarios con Grupo Suplementario para \"&1\"";
            dictMsg["group"]                        = "Grupo";
            dictMsg["groups"]                       = "Grupos";
            dictMsg["edit"]                         = "Editar";
            dictMsg["edit x"]                       = "Editar &1";
            dictMsg["manager"]                      = "Gestor";
            dictMsg["administrator"]                = "Administrador";
            dictMsg["primary group"]                = "Grupo Primario";
            dictMsg["delete x"]                     = "Borrar &1";
            dictMsg["reassign x"]                   = "Reasignar &1";
            dictMsg["navigation item"]              = "Ítem de Navegación";
            dictMsg["navigation items"]             = "Ítems de Navegación";
            dictMsg["navigation panel"]             = "Panel de Navegación";
            dictMsg["home pages"]                   = "Paginas de inicio";
            dictMsg["menu group"]                   = "Grupo de menús";
            dictMsg["menu item"]                    = "Ítem de menú";
            dictMsg["toolbar items"]                = "Ítems de la barra de herramientas";
            dictMsg["toolbar"]                      = "Barra de herramientas";
            dictMsg["button"]                       = "Botón";
            dictMsg["pulldown menu"]                = "Menú desplegable";
            dictMsg["pulldown menu item"]           = "Ítem de menú desplegable";
            dictMsg["separator bar"]                = "Barra separadora";
            dictMsg["spacer"]                       = "Espaciador";
            dictMsg["item details"]                 = "Detalles del ítem";
            dictMsg["item number"]                  = "Numero de ítem";
            dictMsg["item type"]                    = "Tipo de ítem";
            dictMsg["genie macro"]                  = "Macro de Genie";
            dictMsg["rdf application"]              = "Aplicación de archivo de pantalla enriquecido";
            dictMsg["web application"]              = "Aplicación Web";
            dictMsg["pc command"]                   = "Comando PC";
            dictMsg["dspf program library"]         = "Biblioteca del programa de archivo de pantalla";
            dictMsg["dspf program"]                 = "Programa de archivo de pantalla";
            dictMsg["variable name x"]              = "Nombre de variable &1";
            dictMsg["a tab in the portal"]          = "Una pestaña en el portal";
            dictMsg["a new browser wind"]           = "Una nueva ventana o pestaña de navegador";
            dictMsg["update"]                       = "Actualizar";
            dictMsg["fill"]                         = "Llenar";
            dictMsg["permissions"]                  = "Permisos";
            dictMsg["user/group name"]              = "Nombre de usuario/grupo";
            dictMsg["all users groups"]             = "Todos los usuarios y grupo ";
            dictMsg["type"]                         = "Tipo";
            dictMsg["access"]                       = "Acceso";
            dictMsg["allow"]                        = "Permitir";
            dictMsg["disallow"]                     = "Rechazar";
            dictMsg["navigation"]                   = "Navegación";
            dictMsg["add usrgrp perm"]              = "Adicionar permisos de usuario/grupo";
            dictMsg["membership"]                   = "Membresía";
            dictMsg["none"]                         = "Ninguno";
            dictMsg["remove"]                       = "Remover";
            dictMsg["appearance"]                   = "Apariencia";
            dictMsg["home page"]                    = "Página de inicio";
            dictMsg["tree"]                         = "Árbol";
            dictMsg["accordion"]                    = "Acordeón";
            dictMsg["min search chars"]             = "Caracteres de búsqueda mínimos";
            dictMsg["libl for rdf apps"]            = "Lista de bibliotecas para aplicaciones de archivos de pantalla enriquecidos";
            dictMsg["library list"]                 = "Lista de bibliotecas";
            dictMsg["library"]                      = "Biblioteca";
            dictMsg["use atrium def libl"]          = "Usar la lista de bibliotecas por omisión de Atrium";
            dictMsg["use jobd libl"]                = "Usar la lista de bibliotecas de la JOBD";
            dictMsg["specify libl"]                 = "Especificar lista de bibliotecas";
            dictMsg["up"]                           = "Arriba";
            dictMsg["down"]                         = "Abajo";
            dictMsg["move up"]                      = "Mover arriba";
            dictMsg["move down"]                    = "Mover abajo";
            dictMsg["global settings"]              = "Ajustes globales";
            dictMsg["save"]                         = "Salvar";
            dictMsg["add usr to supp grp"]          = "Adicionar usuario o grupo suplementario";
            // Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
            dictMsg["member of"]                    = "Miembro de ";
            dictMsg["member of hlp"]                = "El grupo al cual este usuario/grupo pertenece.";
            dictMsg["group name"]                   = "Nombre de grupo";
            dictMsg["group name hlp"]               = "El nombre a visualizar para este grupo.";
            dictMsg["inherit settings"]             = "Heredar configuraciones";
            dictMsg["inherit settings hlp"]         = "Cuando esta opción es seleccionada, el usuario/grupo heredará la configuración de su ancestro. Cuando no es seleccionada, el usuario/grupo tendrá si propios datos de configuración.";
            dictMsg["user name"]                    = "Nombre de usuario";
            dictMsg["user name hlp"]                = "El nombre a visualizar de este perfil de usuario.";
            dictMsg["access role"]                  = "Rol de acceso";
            dictMsg["access role hlp"]              = "Controla el rol de acceso de este usuario. Los Administradores pueden gestionar todos los grupos y usuarios y también pueden controlar las autorizaciones de la aplicación. Los gestores pueden configurar los parámetros de usuario y grupo dentro de su propio grupo. Los usuarios no tienen privilegios especiales.";
            dictMsg["can edit profile"]             = "Puede editar el perfil";
            dictMsg["can edit profile hlp"]         = "Permite al usuario editar los parámetros de configuración de \"apariencia\" y \"navegación\", y cambiar la contraseña. Los demás parámetros de configuración no son editables por el usuario.";
            dictMsg["user profile"]                 = "Perfil de usuario";
            dictMsg["user profile hlp"]             = "El nombre de perfil de usuario. Los nombres de perfil de usuario son sensibles a mayúsculas y minúsculas, a no ser que se utilicen perfiles de IBM i.";
            dictMsg["password hlp"]                 = "Asignar/restablecer la contraseña. Las contraseñas son sensibles a mayúsculas y minúsculas.";
            dictMsg["conf password"]                = "Confirmar contraseña";
            dictMsg["conf password hlp"]            = "Cuando se asigna/restablece la contraseña, este campo debe coincidir exactamente con la nueva contraseña asignada. Las contraseñas son sensibles a mayúsculas y minúsculas.";
            // Atrium.help tool-tip - User/group Appearance preferences.
            dictMsg["browser title"]                = "Titulo del navegador";
            dictMsg["browser title hlp"]            = "Asigna el texto que será mostrado en la barra de títulos del navegador.";
            dictMsg["show banner"]                  = "Mostrar banner";
            dictMsg["show banner hlp"]              = "Desmarque esta opción si no desea mostrar la banderola en la parte superior del portal.";
            dictMsg["banner height"]                = "Altura del banner";
            dictMsg["banner height hlp"]            = "Asigna la altura del banner en la parte superior del portal en pixeles. Este ajuste es ignorado si ha seleccionado no mostrar la banderola. Los valores validos están entre 0-600 pixeles.";
            dictMsg["banner url"]                   = "URL del banner";
            dictMsg["banner url hlp"]               = "Asigna la URL donde se localiza el contenido del banner. Puede ser tanto una RUL absoluta como una totalmente cualificada.";
            dictMsg["theme"]                        = "Tema";
            dictMsg["theme hlp"]                    = "Asigna el tema por omisión. Este puede ser anulado por los usuarios individuales si el atributo <strong>\"Permitir a los usuarios seleccionar el tema\"</strong> está activado.";
            dictMsg["allow sel theme"]              = "Permitir al usuario seleccionar el tema";
            dictMsg["allow sel theme hlp"]          = "Si está seleccionado, los usuarios tendrán la habilidad de seleccionar su tema deseado usando un control en la barra de herramientas.";
            dictMsg["show menu search"]             = "Mostrar menú de búsqueda";
            dictMsg["show menu search hlp"]         = "Desmarque esta opción para desactivar la característica de búsqueda en el menú.";
            dictMsg["show fav sys"]                 = "Mostrar sistema de favoritos";
            dictMsg["show fav sys hlp"]             = "Desmarque esta opción para desactivar el sistema de favoritos.";
            dictMsg["show fav start"]               = "Mostrar Favoritos en el arranque";
            dictMsg["show fav start hlp"]           = "Si es seleccionado, el panel Favoritos se muestra en el arranque. De lo contrario el panel Navegación será el que se muestre (acción por omisión). Esta opción solo estará disponible si se habilita el sistema Favoritos.";
            dictMsg["limit num sessn"]              = "Limitar el numero de sesiones";
            dictMsg["limit num sessn hlp"]          = "Numero de sesiones Atrium permitidas para este usuario/grupo. Un valor de cero permite sesiones ilimitadas. La limitación se aplica por navegador web.";
            // Atrium.help tool-tip - User/Group navigation preferences.
            dictMsg["show hmpg start"]              = "Mostrar página de inicio en el arranque";
            dictMsg["show hmpg start hlp"]          = "Si es seleccionada esta opción, una página de inicio personalizable será lanzada in el portal al momento del arranque.";
            dictMsg["home page url"]                = "URL de página de inicio";
            dictMsg["home page url hlp"]            = "Asigna el URL donde se localiza el contenido de la página de inicio. Puede ser tanto una URL absoluta como totalmente cualificada.";
            dictMsg["navi pnl title"]               = "Titulo del panel de navegación";
            dictMsg["navi pnl title hlp"]           = "Asigna el texto que será mostrado en la barra de titulo del panel de navegación.";
            dictMsg["navi pnl width"]               = "Ancho de arranque del panel de navegación";
            dictMsg["navi pnl width hlp"]           = "Asigna el ancho de inicio del panel de navegación en pixeles. El usuario puede ajuste o incluso ocultar el panel según su deseo. Los valores validos están entre 0-2000 pixeles.";
            dictMsg["navi type"]                    = "Tipo de navegación";
            dictMsg["navi type hlp"]                = "Controla el tipo de menú usado en el panel de navegación, \"árbol\" o \"acordeón\". Este ajuste no aplica a la barra de herramientas.";
            dictMsg["single click nav"]             = "Navegación de un solo clic";
            dictMsg["single click nav hlp"]         = "Se es seleccionada esta opción, los ítem de menú en el panel de navegación se lanzaran en un solo clic. De lo contrario, se lanzaran únicamente con doble clic. Este ajuste no aplica para la barra de herramientas.";
            // Atrium.help tool-tip - Library list.
            dictMsg["current library"]              = "Biblioteca Actual";
            dictMsg["current library hlp"]          = "Especifica la biblioteca actual, *USRPRF, o *CRTDFT.";
            dictMsg["job descr"]                    = "Descripción de trabajo";
            dictMsg["job descr hlp"]                = "Especifica una descripción de trabajo desde la cual se asigna la lista de bibliotecas. *USRPRF puede ser especificado si los usuarios de Atrium son perfiles de usuario de IBM i.";
            dictMsg["job descr lib"]                = "Biblioteca de descripción de trabajo";
            dictMsg["job descr lib hlp"]            = "Especifique la biblioteca para la descripción de trabajo. *LIBL o *CURLIB pueden ser especificadas.";
            // Atrium.help tool-tip - Navigation / Toolbar items.
            dictMsg["item name"]                    = "Nombre de Ítem";
            dictMsg["item name hlp"]                = "Asigna el nombre a mostrar del ítem de navegación o barra de herramientas.";
            dictMsg["action type"]                  = "Tipo de acción";
            dictMsg["action type hlp"]              = "Asigna el tipo de aplicación que lanza este ítem.";
            dictMsg["url"]                          = "URL";
            dictMsg["url hlp"]                      = "Asigna el URL de la aplicación Web. Esta puede ser especificada tanto en como una ruta absoluta o URL totalmente cualificada. Parámetros tipo Query string pueden ser especificados en el URL.";
            dictMsg["genie url"]                    = "URL de Genie";
            dictMsg["genie url hlp"]                = "Asigna el URL que es usado para lanzar Genie. Si no se especifica esta opciòn, será usada la URL por omisión de Genie /profoundui/auth/genie. Este valor es útil si se requiere una URL alternativa de Genie o parámetros en el query string. Por Ejemplo: /profoundui/auth/genie?skin=MyCompany";
            dictMsg["open as"]                      = "Abrir como";
            dictMsg["open as hlp"]                  = "Establece si lanzar el ítem como una nueva pestaña en el portal, o como una nueva ventana en el navegador. Si el navegador usa una nueva ventana o pestaña depende de los parámetros de configuración del navegador del usuario.";
            dictMsg["opens once only"]              = "Abre únicamente una vez";
            dictMsg["opens once only hlp"]          = "Por omisión, si el usuario lanza este ítem cuando ya existe una pestaña abierta para este en el portal, se abre otra pestaña para el ítem. No existe limitación en el numero de pestañas que el usuario puede abrir de esta manera. Cuando esta opción es seleccionada, el usuario no podrá abrir mas de una pestaña para este ítem. Si ya existe una pestaña abierta para el ítem cuando el usuario la selecciona, la pestaña existente se activará. Esta opción se ignora cuando se abre el ítem en una nueva ventana o pestaña de navegador.";
            dictMsg["icon"]                         = "Icono";
            dictMsg["icon hlp"]                     = "Opcional. Asigna un archivo con el icono que será usado para el ítem de navegación o barra de herramientas. El archivo del icono puede estar en formato TGIF, JPG, o PNG. Se recomiendan GIFs transparentes. La ruta debería ser entregada como una ruta absoluta desde el directorio raíz de la instalación Atrium. Si no se especifica icono, Atrium utilizará un icono de navegación por omisión para los ítems de navegación. No se mostrará ningún icono para los ítems de la barra de herramientas, a no ser que se especifique aquí.";
            dictMsg["parameter"]                    = "Parámetro";
            dictMsg["parameter hlp"]                = "Opcional: Especifica un parámetro que será pasado a su programa de pantalla enriquecida cuando este se lanza.";

            break;

        default:
            console.log("Unknown Dictionary Type : '" + dict + "'");
    }

    return dictMsg;
};