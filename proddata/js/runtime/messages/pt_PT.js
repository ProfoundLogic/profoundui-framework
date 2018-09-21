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

// ----------------------------------
//  Portuguese (Portugal)
// ----------------------------------
var pt_PT = function(dict) {

    var dictMsg = {};

    switch (dict) {

        case "runtimeMsg":
            dictMsg["closeMessage"]                 = "A sua sessão irá terminar.";
            dictMsg["no connection message"]        = "Não é possível estabelecer ligação com o servidor. Verifique a ligação e tente de novo.";
            dictMsg["upload file limit"]            = "Limite de &1 ficheiro(s) excedido.";
            dictMsg["upload size limit"]            = "Limite de &1MB por ficheiro excedido";
            dictMsg["upload no files"]              = "Não há ficheiros selecionados.";
            dictMsg["upload duplicate file"]        = "Foram selecionados ficheiros em duplicado.";
            dictMsg["upload file exists"]           = "Um ou mais ficheiros já existem no sistema de ficheiros.";
            dictMsg["upload prevented"]             = "Operação impedida por 'exit program'.";
            dictMsg["upload input limit"]           = "Foi excedido o limite do tamanho total do 'input'.";
            dictMsg["upload no session"]            = "Não está conectado a uma sessão válida.";
            dictMsg["upload timeout"]               = "Foi excedido o tempo limite para a transacção.";
            dictMsg["upload invalid response"]      = "Não existe resposta do servidor ou a mesma é inválida.";  //Also used in Atrium for Ajax error.
            dictMsg["upload cancelled"]             = "Upload cancelado.";
            dictMsg["close browser text"]           = "A fim de completar o processo de encerramento da sessão, por favor feche a janela do browser.";
            dictMsg["session ended text"]           = "A sua sessão foi encerrada.";
            dictMsg["outside ucs2"]                 = 'Caractéres fora do âmbito UCS-2.';
            dictMsg["invalid number"]               = '&1 não é um número válido.';
            dictMsg["invalid length"]               = '&1 tem comprimento ou número de casas decimais incorrectos.';
            dictMsg["invalid decimal"]              = '&1 tem demasiadas casas decimais. (max: &2)';
            dictMsg["invalid choice"]               = '"&1" é inválido. Escolhas válidas são: "&2" ou "&3".';
            dictMsg["invalid date"]                 = '"&1" não é uma data válida. Exemplo de formato correcto: &2';
            dictMsg["invalid time"]                 = '"&1" não é uma hora válida. Exemplo de formato correcto: &2';
            dictMsg["invalid time stamp"]           = '"&1" não é um formato de data e hora válido. Exemplo de formato correcto: &2';
            dictMsg["invalid percent"]              = '&1 não é um valor decimal.';
            dictMsg["invalid digits"]               = '"&1" contém demasiados dígitos. Max: &2';
            dictMsg["exceeds whole"]                = '"&1" excede o número máximo de dígitos para a parte numérica do campo (&2 digits).';
            dictMsg["exceeds decimal"]              = '"&1" excede o número máximo de dígitos para a parte decimal do campo (&2 digits).';
            dictMsg["zip too long"]                 = 'O código postal é demasiado grande. (Maximum: &1 digits)';
            dictMsg["phone too long"]               = 'O número de telefone é demasiado grande. (Maximum: &1 digits)';
            dictMsg["ssno too long"]                = 'O código da segurança social é demasiado grande. (Maximum: &1 digits)';
            dictMsg["invalid custom val"]           = 'Validação de função customizada inválida.';
            dictMsg["error custom val"]             = 'Erro na validação de função costumizada.';
            dictMsg["ME"]                           = "Campo obrigatório. Tem que introduzir dados.";
            dictMsg["MF"]                           = "Campo de preenchimento total obrigatório. Deve preencher o campo na sua totalidade.";
            dictMsg["required"]                     = "O valor não pode estar a branco. Este campo é obrigatório.";
            dictMsg["file required"]                = "Deve seleccionar pelo menos um ficheiro.";
            dictMsg["signature overflow"]           = "A imagem da assinatura excede o número máximo de bytes disponíveis para o seu armazenamento. Por favor limpe a caixa da assinatura e tente de novo.";
            dictMsg["validValues"]                  = "O valor introduzido não é válido. Valores válidos: ";
            dictMsg["upload invalid type"]          = "Um ou mais ficheiros são de tipo inválido.";
            dictMsg["invalid email"]                = "e-mail Inválido.";
            dictMsg["session timed out"]            = "A sua sessão expirou.";
            dictMsg["invalid low range"]            = "O valor deve ser maior ou igual a &1";
            dictMsg["invalid high range"]           = "O valor deve ser menor ou igual a &1";
            dictMsg["invalid range"]                = "O Intervalo válido é de &1 a &2";
            dictMsg["unmonitored exception"]        = "A aplicação encontrou uma excepção não monitorizada. Por favor contacte o administrador de sistema.";
            dictMsg["loading x"]                    = "A carregar &1...";
            dictMsg["data src not specfd x"]        = "Origem dos dados não especificada para &1...";
            dictMsg["name fld not specfd x"]        = "Nome do campo não especificado para &1...";
            dictMsg["val fld not specfd x"]         = "Valor do campo não especificado para &1...";
            dictMsg["failed to load x"]             = "Falha ao carregar &1.";
            dictMsg["cannot rmv last col"]          = "Não pode eliminar a última coluna.";
            dictMsg["cannot find col"]              = "ID da coluna especificada não encontrado.";
            dictMsg["subfile deletion"]             = "Tem certeza que deseja excluir o subarquivo?";
            dictMsg["downloading x"]                = "Downloading &1";
            dictMsg["ie9 too low xlsxpics"]         = "Imagens não podem ser exportadas utilizando o IE9 ou inferior.";

            // Atrium only.
            dictMsg["num sessions exceeded"]        = "Excedido o número de sessões autorizadas.";
            dictMsg["unable to load portal"]        = "Não foi possível carregar as configurações do portal ou items de navegação.";
            dictMsg["unable to load macr act"]      = "Não foi possível carregar as acções macro.";
            dictMsg["unable to load macr var"]      = "Não foi possível carregar as variáveis macro.";
            dictMsg["unable to load scrn lst"]      = "Não foi possível carregar a lista de ecrã.";
            dictMsg["unable to load new sett"]      = "Não foi possível carregar novas definições.";
            dictMsg["unable to load x"]             = "Não foi possível carregar &1.";
            dictMsg["unable to add x"]              = "Não foi possível adicionar &1.";
            dictMsg["unable to rename x"]           = "Não foi possível mudar o nome a &1.";
            dictMsg["unable to delete x"]           = "Não foi possível apagar &1.";
            dictMsg["unable to update x"]           = "Não foi possível alterar &1.";
            dictMsg["unable to reassn x"]           = "Não foi possível reasignar &1.";
            dictMsg["unable to reorder items"]      = "Não foi possível reordenar os items.";
            dictMsg["unable to save theme"]         = "Não foi possível gravar as definições do tema.";
            dictMsg["unable eval script url"]       = "Não foi possível avaliar o URL da scripted web app.";
            dictMsg["close browser text AT"]        = "As alterações não gravadas na sessão ou sessões serão perdidas.";
            dictMsg["close all tabs"]               = "Fechar todos os separadores?";
            dictMsg["close tab"]                    = "Deseja fechar este seperador?";
            dictMsg["invalid script url"]           = "Valor inválido para o URL da scripted web app.";
            dictMsg["unrecognized format"]          = "Formato não reconhecido.";
            dictMsg["screen already defined"]       = "Ecrã\"&1\" já definido.";
            dictMsg["macro already defined"]        = "Macro \"&1\" já definida.";
            dictMsg["no screen ids"]                = "Não existem identificadores do ecrã para mostrar";
            dictMsg["confirm delete"]               = "Deseja eliminar";
            dictMsg["no actions"]                   = "Não existem acções para mostar.";
            dictMsg["msg action input var"]         = "Introduza o valor na variável\"&1\" no campo da linha &2 coluna &3.";
            dictMsg["msg action input user"]        = "Introduza o perfil de utilizador actual no campo da linha &1 coluna &2.";
            dictMsg["msg action input js"]          = "Introduza o resultado da expressão de JavaScript <strong>&1</strong> no campo da linha &2 coluna &3.";
            dictMsg["msg action input other"]       = "Introduza o valor \"&1\" no campo da linha &2 coluna &3.";
            dictMsg["msg presskey var"]             = "Pressione a tecla definida na variável \"&1\".";
            dictMsg["msg presskey other"]           = "Pressione a tecla \"&1\".";
            dictMsg["msg del scrn from macro"]      = "Tem a certeza que quer eliminar o(s) ecrã(s) seleccionados desta macro?<br /> Todas as acções associadas também serão eliminadas.";
            dictMsg["choose scrn macro"]            = "Escolha um ecrã ou macro para trabalhar com as suas propriedades.";
            dictMsg["choose a nav or toolbar"]      = "Escolha um item de navegação ou de barra de ferramentas para trabalhar com as suas propriedades.";
            dictMsg["confirm del sel x"]            = "Tem a certeza que quer eliminar o(a) &1?";
            dictMsg["permission settings"]          = "Definição de permissões";
            dictMsg["adding x"]                     = "Adicionando &1...";
            dictMsg["deleting x"]                   = "Eliminando &1 ...";
            dictMsg["reassigning x"]                = "Reasignando &1...";
            dictMsg["loading"]                      = "A carregar...";
            dictMsg["saving"]                       = "Gravando...";
            dictMsg["x added"]                      = "&1 adicionado(s).";
            dictMsg["x deleted"]                    = "&1 eliminado(s).";
            dictMsg["x reassigned"]                 = "&1 re-assignado(s).";
            dictMsg["x updated"]                    = "&1 alterado(s).";
            dictMsg["x saved"]                      = "&1 gravado(s).";
            dictMsg["msg del group"]                = "Tem a certeza que quer eliminar o grupo \"&1\"?<br /><br />Apagar o(s) grupo(s) irá apagar também qualquer subgrupo e utilizador(es) associado(s).<br /><br />Tem a certeza que quer continuar?";
            dictMsg["conf reassign users 1"]        = "Tem a certeza que quer re-assignar ";
            dictMsg["conf reassign users 2a"]       = "Utilizador \"&1\" ";
            dictMsg["conf reassign users 2b"]       = "Os utilizadores seleccionados ";
            dictMsg["conf reassign users 3"]        = " para o grupo \"&1\"?";
            dictMsg["conf reassign group"]          = "Tem a certeza que quer re-assignar o grupo \"&1\" ao grupo \"&2\"?";
            dictMsg["conf delete users 1"]          = "Tem a certeza que quer eliminar";
            dictMsg["conf delete users 2a"]         = "utilizador \"&1\"?";
            dictMsg["conf delete users 2b"]         = "os utilizadores seleccionados?";
            dictMsg["no users"]                     = "Não existem utilziadores para mostrar.";
            dictMsg["cannot delete own grp"]        = "Não pode eliminar o seu próprio grupo.";
            dictMsg["cannot delete own usr"]        = "Não pode eliminar o seu próprio perfil de utilizador.";
            dictMsg["not auth reassign prf"]        = "Não está autorizado a re-assignar o seu próprio perfil de utilizador.";
            dictMsg["typeselect macro name"]        = "Escreva ou seleccione o nome da macro...";
            dictMsg["any child items will"]         = "Quaisquer itens dependente também será eliminado.";
            dictMsg["password must be"]             = "As Passwords têm que ter pelo menos 6 caracteres.";
            dictMsg["type or sel home page"]        = "Escreva ou seleccione a página principal...";
            dictMsg["x is already in list"]         = "\"&1\" já está na lista.";
            dictMsg["x is not valid libname"]       = "\"&1\" não é um nome de biblioteca válido.";
            dictMsg["no libraries in list"]         = "Não existem bibliotecas na lista";
            dictMsg["add libl entry"]               = "Adicionar uma entrada na lista de bibliotecas";
            dictMsg["would you like add ano"]       = "Deseja adicionar outra(o)?";
            dictMsg["already in suppl grp x"]       = "Utilizador já existe no grupo suplementar \"&1\".";

            break;

        case "runtimeText":
            dictMsg["upload select text"]           = "Ficheiros Selecionados";
            dictMsg["upload clear text"]            = "Limpar";
            dictMsg["upload remove text"]           = "Remover";
            dictMsg["upload upload text"]           = "Enviar";
            dictMsg["upload drophere text"]         = "Colocar os ficheiros aqui";
            dictMsg["upload browser unsupported"]   = "Para efectuar o Drag/drop de ficheiros necessita do Internet Explorer 10 ou superior , Chrome, ou Firefox";
            dictMsg["upload finished text"]         = "Terminado";
            dictMsg["excel export text"]            = "Exportar para Excel";    //Replaces "csv export text".
            dictMsg["export to x"]                  = "Exportar para &1";
            dictMsg["filter text"]                  = "Filtrar";
            dictMsg["find text"]                    = "Procurar";
            dictMsg["reset data"]                   = "Reset";
            dictMsg["remove filters text"]          = "Remover Todos os Filtros";
            dictMsg["displayed columns"]            = "Colunas Apresentadas";
            dictMsg["next link text"]               = "Próximo";
            dictMsg["previous link text"]           = "Anterior";
            dictMsg["sort ascending text"]          = "Ordenar Ascendentemente";
            dictMsg["sort descending text"]         = "Ordenar Descendentemente";
            dictMsg["row"]                          = "linha";
            dictMsg["rows"]                         = "linhas";
            dictMsg["page"]                         = "Página";
            dictMsg["collapseAll"]                  = "Recolher tudo";
            dictMsg["expandAll"]                    = "Expandir tudo";
            dictMsg["user"]                         = "Utilizador";
            dictMsg["password"]                     = "Palavra Passe";
            dictMsg["sign on"]                      = "Entrar";
            dictMsg["pui"]                          = "Profound UI";
            dictMsg["pui sign on"]                  = dictMsg["sign on"] + " em " + dictMsg["pui"];
            dictMsg["pjs"]                          = "Profound.js";
            dictMsg["pjs sign on"]                  = dictMsg["sign on"] + " em " + dictMsg["pjs"];
            dictMsg["message id"]                   = "Id da mensagem";
            dictMsg["ctlr job"]                     = "Controlador do trabalho";
            dictMsg["app job"]                      = "Aplicação do trabalho";
            dictMsg["joblog download"]              = "Download Logs do trabalho";
            dictMsg["curr user"]                    = "Utilizador actual";
            dictMsg["remote ip"]                    = "IP Address Remoto";
            dictMsg["remote port"]                  = "Porta Remota";
            dictMsg["severity"]                     = "Severidade";
            dictMsg["date"]                         = "Data";
            dictMsg["time"]                         = "Hora";
            dictMsg["program"]                      = "Programa";
            dictMsg["procedure"]                    = "Procedimento";
            dictMsg["lines"]                        = "Linha(s)";
            dictMsg["message"]                      = "Mensagem";
            dictMsg["new session"]                  = "Nova Sessão";
            dictMsg["close"]                        = "Fechar";
            dictMsg["current password"]             = "Palavra Chave Actual";
            dictMsg["new password"]                 = "Palavra Chave Nova";
            dictMsg["repeat new password"]          = "Repetir Palavra Chave";
            dictMsg["submit"]                       = "Submeter";
            dictMsg["exit"]                         = "Sair";
            dictMsg["warning"]                      = "Aviso";
            dictMsg["change password"]              = "Alterar Palavra Chave";
            dictMsg["cancel"]                       = "Cancelar";
            dictMsg["find text"]                    = "Encontrar";
            dictMsg["remove filter"]                = "Retirar filtro";
            dictMsg["chart"]                        = "Gráfico";
            dictMsg["section"]                      = "Secção";
            dictMsg["version"]                      = "Versão";
            dictMsg["fixPack"]                      = "Pacote de correção";
            // Atrium only.
            dictMsg["yes"]                          = "Sim";
            dictMsg["no"]                           = "Não";
            dictMsg["settings"]                     = "Definições";
            dictMsg["favorites"]                    = "Favoritos";
            dictMsg["type query press en"]          = "Digite query, e prima Enter.";
            dictMsg["add to favorites"]             = "Adicionar aos Favoritos";
            dictMsg["rmv from favorites"]           = "Remover dos Favoritos";
            dictMsg["please wait"]                  = "Aguarde por favor...";
            dictMsg["control panel"]                = "Painel de Controlo";
            dictMsg["my settings"]                  = "AS minhas Definições";
            dictMsg["about atrium"]                 = "Acerca de Atrium";
            dictMsg["about atrium msg"]             = dictMsg["version"] + " " + window["pui"]["baseVersion"] + ", " + dictMsg["fixPack"] + " " + window["pui"]["fixPackVersion"] + "<br /><br />"
                                                    + "Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
                                                    + "Aviso: Este programa de computador está protegido por copyright por lei<br />"
                                                    + "e tratados internacionais. Qualquer reprodução ou distribuição não autorizada ou qualquer parte do mesmo pode reseultar em<br />"
                                                    + "severas penalizações e processos criminais até ao limite máximo da lei.<br /><br />"
                                                    + "Patenteado. &nbsp;U.S. Patente No. 8,667,405 B2.";
                                                    //
                                                    // Portuguese copyright message was trimmed
            dictMsg["item"]                         = "Item";
            dictMsg["open selected item"]           = "Abrir o Item seleccionado";
            dictMsg["of"]                           = "de";
            dictMsg["no results to dsp"]            = "Não existem resultados para mostrar.";
            dictMsg["displaying results"]           = "Mostrando os resultados";
            dictMsg["search results"]               = "Resultados da pesquisa";
            dictMsg["new folder"]                   = "Nova Pasta";
            dictMsg["rename"]                       = "Mudar o nome";
            dictMsg["description"]                  = "Descrição";
            dictMsg["ok"]                           = "OK";
            dictMsg["add"]                          = "Adicionar";
            dictMsg["add x"]                        = "Adicionar &1";
            dictMsg["delete"]                       = "Eliminar";
            dictMsg["screen"]                       = "Ecrã";
            dictMsg["screens"]                      = "Ecrans";
            dictMsg["macro"]                        = "Macro";
            dictMsg["macros"]                       = "Macros";
            dictMsg["screen id"]                    = "Identificador de Ecrã";
            dictMsg["screen ids"]                   = "Identificadores de Ecrans";
            dictMsg["field row"]                    = "Campo de Linha";
            dictMsg["field column"]                 = "Campo de Coluna";
            dictMsg["field value"]                  = "Campo de Valor";
            dictMsg["value"]                        = "Valor";
            dictMsg["action"]                       = "Acção";
            dictMsg["actions"]                      = "Acções";
            dictMsg["detect once"]                  = "Eliminar uma vez";
            dictMsg["delete screen"]                = "Eliminar Ecrã";
            dictMsg["genie macros"]                 = "Genie Macros";
            dictMsg["screen name"]                  = "Nome do Ecrã";
            dictMsg["identifier"]                   = "Identificador";
            dictMsg["identifiers"]                  = "Identificadores";
            dictMsg["macro name"]                   = "Nome da Macro";
            dictMsg["close browser wintab"]         = "Fechar a janela ou seprador do browser.";
            dictMsg["select"]                       = "Seleccionar";
            dictMsg["write value in field"]         = "Escreva um valor num campo";
            dictMsg["press a key"]                  = "Prima uma tecla";
            dictMsg["a literal value"]              = "Um valor literal";
            dictMsg["a variable value"]             = "Um valor variavel";
            dictMsg["cur user profile"]             = "O perfil de utilizador actual";
            dictMsg["result js expr"]               = "O resultado de uma expressão de JavaScript";
            dictMsg["action data"]                  = "Action data";
            dictMsg["data type"]                    = "Tipo dos Dados";
            dictMsg["users"]                        = "Utilizadores";
            dictMsg["all groups"]                   = "Todos os Grupos";
            dictMsg["supplemental groups"]          = "Grupos Suplementares";
            dictMsg["users w primary grp"]          = "Utilizadores cujo Grupo Primário é\"&1\"";
            dictMsg["users w suppl grp"]            = "Utilizaodres cujo Grupo Suplementar é\"&1\"";
            dictMsg["group"]                        = "Grupo";
            dictMsg["groups"]                       = "Grupos";
            dictMsg["edit"]                         = "Editar";
            dictMsg["edit x"]                       = "Editar &1";
            dictMsg["manager"]                      = "Gerir";
            dictMsg["administrator"]                = "Administrador";
            dictMsg["primary group"]                = "Grupo Primário";
            dictMsg["delete x"]                     = "Eliminar &1";
            dictMsg["reassign x"]                   = "Re-assignar &1";
            dictMsg["navigation item"]              = "Item de Navegação";
            dictMsg["navigation items"]             = "Itens de Navegação";
            dictMsg["navigation panel"]             = "Painel de Navegação";
            dictMsg["home pages"]                   = "Páginas Principais";
            dictMsg["menu group"]                   = "Grupo de Menu";
            dictMsg["menu item"]                    = "Item de Menu";
            dictMsg["toolbar items"]                = "Items da Barra de Ferramentas";
            dictMsg["toolbar"]                      = "Barra de Ferramentas";
            dictMsg["button"]                       = "Botão";
            dictMsg["pulldown menu"]                = "Menu de Pulldown";
            dictMsg["pulldown menu item"]           = "Item de Menu de Pulldown";
            dictMsg["separator bar"]                = "Barra de Separação";
            dictMsg["spacer"]                       = "Espacejador";
            dictMsg["item details"]                 = "Detalhes do Item";
            dictMsg["item number"]                  = "Número do Item";
            dictMsg["item type"]                    = "Tipo do Item";
            dictMsg["genie macro"]                  = "Genie Macro";
            dictMsg["rdf application"]              = "Aplicação Rich Display File";
            dictMsg["web application"]              = "Apliacação Web";
            dictMsg["pc command"]                   = "Comando de PC";
            dictMsg["dspf program library"]         = "Biblioteca de programa de ficheiro de ecrã";
            dictMsg["dspf program"]                 = "Programa de ficheiro de ecrã";
            dictMsg["variable name x"]              = "Nome da variável &1";
            dictMsg["a tab in the portal"]          = "Um separador no portal";
            dictMsg["a new browser wind"]           = "Nova janela ou separador do browser";
            dictMsg["update"]                       = "Alterar";
            dictMsg["fill"]                         = "Preencher";
            dictMsg["permissions"]                  = "Permissões";
            dictMsg["user/group name"]              = "Nome do Utilizador/Grupo";
            dictMsg["all users groups"]             = "Todos os Utilizadores e Grupos";
            dictMsg["type"]                         = "Tipo";
            dictMsg["access"]                       = "Accesso";
            dictMsg["allow"]                        = "Permitir";
            dictMsg["disallow"]                     = "Não Permitir";
            dictMsg["navigation"]                   = "Navegação";
            dictMsg["add usrgrp perm"]              = "Adicionar Permissões de Utilizador/Grupo";
            dictMsg["membership"]                   = "Associação";
            dictMsg["none"]                         = "Nenhum";
            dictMsg["remove"]                       = "Remover";
            dictMsg["appearance"]                   = "Aparência";
            dictMsg["home page"]                    = "Página Principal";
            dictMsg["tree"]                         = "Árvore";
            dictMsg["accordion"]                    = "Acordião";
            dictMsg["min search chars"]             = "Minimo de caracteres de pesquisa";
            dictMsg["libl for rdf apps"]            = "Lista de Bibliotecas para Aplicações Rich Display File";
            dictMsg["library list"]                 = "Lista de Bibliotecas";
            dictMsg["library"]                      = "Biblioteca";
            dictMsg["use atrium def libl"]          = "Utilizar a lista de bibliotecas padarão do Atrium";
            dictMsg["use jobd libl"]                = "Utilizar a lista de bibliotecas da JOBD";
            dictMsg["specify libl"]                 = "Especifique a lista de bibliotecas";
            dictMsg["up"]                           = "Cima";
            dictMsg["down"]                         = "Baixo";
            dictMsg["move up"]                      = "Mover para Cima";
            dictMsg["move down"]                    = "Mover para Baixo";
            dictMsg["global settings"]              = "Definições Globais";
            dictMsg["save"]                         = "Gravar";
            dictMsg["add usr to supp grp"]          = "Adicionar o Utilizador ao Grupo Suplementar";
            // Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
            dictMsg["member of"]                    = "Membro de";
            dictMsg["member of hlp"]                = "O grupo a que este utilizador/grupo pertence.";
            dictMsg["group name"]                   = "Nome do Grupo";
            dictMsg["group name hlp"]               = "O nome do ecrã para este grupo.";
            dictMsg["inherit settings"]             = "Definições herdadas";
            dictMsg["inherit settings hlp"]         = "Quando esta opção está seleccionada, o utilizador/grupo irá gerdar as definições do seu 'Pai'. Quando não está seleccionada, o utilizador/grupo terá as suas próprias definições.";
            dictMsg["user name"]                    = "Nome do Utilizador";
            dictMsg["user name hlp"]                = "O nome do ecrã deste perfil de utilizador.";
            dictMsg["access role"]                  = "Função de Acesso";
            dictMsg["access role hlp"]              = "Controla a função de acesso deste utilizador. Administradores podem gerir todos os grupos e utilizadores, e podem também controlar as autoridades da aplicação. Gestores podem configurar as definições de utilizadores e grupos dentro do seu próprio grupo. Utilizadores não têm previlégios especiais.";
            dictMsg["can edit profile"]             = "Pode editar o perfil";
            dictMsg["can edit profile hlp"]         = "Permite ao utilizador editar definições de \"aparência\" e \"navegação\", e alterar a password. Todas as outras definições nunca são editáveis pelo utilizador.";
            dictMsg["user profile"]                 = "Perfil de Utilizador";
            dictMsg["user profile hlp"]             = "O nome do perfil de utilizador. Perfis de utilizadorUser são case sensitive, excepto se forem utilizados perfis de IBM i.";
            dictMsg["password hlp"]                 = "Define/limpa a password. Passwords são case sensitive.";
            dictMsg["conf password"]                = "Confirmar a Password";
            dictMsg["conf password hlp"]            = "Quando define/limpa a password, este campo tem que ser exactamente igual á nova password definida. Passwords são case sensitive.";
            // Atrium.help tool-tip - User/group Appearance preferences.
            dictMsg["browser title"]                = "Titulo do Browser";
            dictMsg["browser title hlp"]            = "Define o texto que irá aparecer na barra de titulo do browser.";
            dictMsg["show banner"]                  = "Mostra banner";
            dictMsg["show banner hlp"]              = "Não seleccione esta opção se não quiser mostar o banner no topo do portal.";
            dictMsg["banner height"]                = "Altura do Banner";
            dictMsg["banner height hlp"]            = "Define a altura do banner em pixels no topo do portal. Esta definição é ignorada se tiver escolhido não mostrar o banner. Valores válidos são 0-600 pixels.";
            dictMsg["banner url"]                   = "URL do Banner";
            dictMsg["banner url hlp"]               = "Define o URL onde o conteúdo do banner está localizado. O URL pode ser absoluto ou definido na sua totalidade.";
            dictMsg["theme"]                        = "Tema";
            dictMsg["theme hlp"]                    = "Definie o tema por defeito. Pode ser substituido por utilizadores individuais se <strong>\"Permite utilizadores seleccionar o tema\"</strong> está activo.";
            dictMsg["allow sel theme"]              = "Permite ao utilizador seleccionar o tema";
            dictMsg["allow sel theme hlp"]          = "Se seleccionado, os utilizadores poderão seleccionar o tema por eles desejado utilizando um control na barra de ferramentas.";
            dictMsg["show menu search"]             = "mostra pesquisa de menu";
            dictMsg["show menu search hlp"]         = "Não seleccione se não quiser activar a funcionalidade de pesquisa de menu.";
            dictMsg["show fav sys"]                 = "Mostra Favoritos do sistema";
            dictMsg["show fav sys hlp"]             = "Desmarque para desactivar os Favoritos do sistema.";
            dictMsg["show fav start"]               = "Mostar Favoritos no arranque";
            dictMsg["show fav start hlp"]           = "Se seleciconado, o painel de Favoritos será mostrado no arranque. Se não, será mostrado o painel de Navegação (por defeito). Esta opção apenas estará disponivel se a opção Favoritos do sistema estiver activa.";
            dictMsg["limit num sessn"]              = "Limitar número de sessões";
            dictMsg["limit num sessn hlp"]          = "Número de sessões de Atrium permitidas para este utilizador/grupo. Um valor de zero permite número de sessões ilimitadas. A limitação é aplicada por web browser.";
            // Atrium.help tool-tip - User/Group navigation preferences.
            dictMsg["show hmpg start"]              = "Mostra página principal no arranque";
            dictMsg["show hmpg start hlp"]          = "Se seleccionado, no arranque será mostrada uma página principal customizável.";
            dictMsg["home page url"]                = "URL da página principal";
            dictMsg["home page url hlp"]            = "Define o URL onde o conteúdo da página principal está localizado. O URL pode ser absoluto ou definido na sua totalidade.";
            dictMsg["navi pnl title"]               = "Titulo do painel de Navegação";
            dictMsg["navi pnl title hlp"]           = "Define o texto que será mostrado na barra de titulo do painel de navegação.";
            dictMsg["navi pnl width"]               = "Largura inicial do painel de Navegação";
            dictMsg["navi pnl width hlp"]           = "Define a largura inicial do painel de Navegação em pixels. O utilizador pode redimensionar ou esconder o painel se desejado. Valores válidos são 0-2000 pixels.";
            dictMsg["navi type"]                    = "Tipo de Navigação";
            dictMsg["navi type hlp"]                = "Controla o tipo de menu utilizado no painel de navegação, \"tree\" or \"accordion\". Esta definição não se aplica á barra de ferramentas.";
            dictMsg["single click nav"]             = "Navegação com apenas um click";
            dictMsg["single click nav hlp"]         = "Se seleccionado, os items no painel de navegação irão arrancar apenas com um click. De outra forma, irão arrancar apenas com duplo click. Esta definição não se aplica á barra de ferramentas.";
            // Atrium.help tool-tip - Library list.
            dictMsg["current library"]              = "biblioteca actual";
            dictMsg["current library hlp"]          = "Especifica a biblioteca actual, *USRPRF, ou *CRTDFT.";
            dictMsg["job descr"]                    = "Descrição do Trabalho";
            dictMsg["job descr hlp"]                = "Especifica a descrição do Trabalho para definir a lista de bibliotecas de origem. *USRPRF pode ser especificada  se os utilizadores do Atrium forem perfis de utilizadores de IBM i.";
            dictMsg["job descr lib"]                = "Biblioteca da descrição do Trabalho";
            dictMsg["job descr lib hlp"]            = "SEspecifica a biblioteca para a descrição do Trabalho. *LIBL ou *CURLIB podem ser especificadas.";
            // Atrium.help tool-tip - Navigation / Toolbar items.
            dictMsg["item name"]                    = "nome do Item";
            dictMsg["item name hlp"]                = "Define o nome do ecrã do item de navegação ou barra de ferramentas.";
            dictMsg["action type"]                  = "Tipo de Acção.";
            dictMsg["action type hlp"]              = "Define o tipo de aplicação que este Item lança.";
            dictMsg["url"]                          = "URL";
            dictMsg["url hlp"]                      = "Define o URL da aplicação Web. Pode ser especificado como um caminho absoluto ou um URL definido na sua totalidade. Parametros de Query podem ser especificados no URL.";
            dictMsg["genie url"]                    = "URL de Genie";
            dictMsg["genie url hlp"]                = "Define o URL que é utilizado para lançar o Genie. Se não for especificado, será utilizado o URL Default do Genie /profoundui/auth/genie . Este campo é util se um URL alternativo do Genie ou parametros de qwery forem requeridos. Por exemplo: /profoundui/auth/genie?skin=MyCompany";
            dictMsg["open as"]                      = "Abrir como";
            dictMsg["open as hlp"]                  = "Define se abre o item como um novo separador no portal ou como uma nova janela ou separador do browser. Se o browser utiliza a definição de nova janela ou separador, depende das definições do utilizador no browser.";
            dictMsg["opens once only"]              = "Abre apenas uma vez";
            dictMsg["opens once only hlp"]          = "Por defeito, se o utilizador lançar este item quando este já tem um separador aberto no portal, um outro separador será aberto para o item. Não existe limitação no número de separadores que o utilizador pode abrir desta forma. Quando 'this open' está seleccionado, o utilzador não poderá abrir mais que um separador para o item. Se já estiver aberto um separador para este item, o separador existente será activado. Esta opção é ignorada quando o se abre o item numa nova janela ou separador do browser.";
            dictMsg["icon"]                         = "Icon";
            dictMsg["icon hlp"]                     = "Opcional. Definie o ficheiro de icon a ser utilizado na navegação ou barra de ferramentas. O ficheiro do icon pode ser dos formatos GIF, JPG, or PNG. GIFs transparentes são recomendados. O caminho deve ser dado com absoluto desde a raiz da instalação do Atrium. Se nenhum icon for especificado, Atrium irá utilizar o icon por defeito para os itens de navegação. Nenhum icon será mostrado para a barra de ferramentas, a não ser que seja especificado aqui.";
            dictMsg["parameter"]                    = "Parâmetro";
            dictMsg["parameter hlp"]                = "Opcional: Define o parâmetro que irá ser passado para o Rich Display do programa quando este é lançado.";

            break;

        default:
            console.log("Unknown Dictionary Type : '" + dict + "'");
    }

    return dictMsg;
};