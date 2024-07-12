document.addEventListener('DOMContentLoaded', function () {
    // API URL
    const apiUrl = 'http://localhost:5000';

    let filtro_estado_tarefa = "todas"
    let mudarTodasConcluidasPara = false
    let tarefasString = ""

    function generateUUIDv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Generate and display the UUID
    const myUUID = generateUUIDv4();
    // console.log(myUUID);

    // DOM
    const adicionarTarefaForm = document.getElementById('adicionarTarefaForm');
    const tarefaTituloInput = document.getElementById('tarefaTitulo');
    const tarefaList = document.getElementById('tarefaList');
    const detalhesTarefa = document.getElementById('detalhesTarefa');
    const tarefasRestantes = document.getElementById('tarefasRestantes')
    const limparConcluidas = document.getElementById('limparConcluidas')
    const share = document.getElementById('share')
    const filtroTodas = document.getElementById('filtroTodas')
    const filtroAtivas = document.getElementById('filtroAtivas')
    const filtroCompletas = document.getElementById('filtroCompletas')
    const listaTarefas = document.getElementById('listaTarefas')
    const filtrosFooter = document.getElementById('filtrosFooter')
    const marcarTodas = document.getElementById('marcar-todas')

    function exibirToast(message) {
      const toastContainer = document.getElementById("container-toast");
      toastContainer.textContent = message;
      toastContainer.style.display = "block";

      // Esconde o toast depois de 3 segundos
      setTimeout(function() {
        toastContainer.style.display = "none";
      }, 3000);
    }

    // Função que busca e exibe a lista de tarefas
    function buscarTarefas() {
        fetch(`${apiUrl}/tarefa/todas`)
            .then(response => response.json())
            .then(data => {
                tarefaList.innerHTML = '';
                let contador = 0
                let contador_completas = 0
                // tarefasString = data.tarefas
                tarefasString = ""
                data.tarefas.forEach(tarefa => {
                    if (tarefa.concluida) {
                        contador_completas += 1
                    }
                    if (filtro_estado_tarefa === "todas"){
                        contador += 1
                        criarLinhaTarefa(tarefa)
                    } else if (filtro_estado_tarefa === "ativas") {
                        if (tarefa.concluida === false){
                            contador += 1
                            criarLinhaTarefa(tarefa)
                        }
                    } else if (filtro_estado_tarefa === "completas") {
                        if (tarefa.concluida){
                            contador += 1
                            criarLinhaTarefa(tarefa)
                        }
                    }
                })

                tarefasRestantes.innerText=contador.toString()
                limparConcluidas.hidden = contador_completas === 0;
                // share.hidden = contador_completas === 0;
                listaTarefas.hidden = contador === 0;
                filtrosFooter.hidden = data.tarefas.length === 0 ;
            });
    }

    //Adiciona uma tarefa a lista
    function criarLinhaTarefa(tarefa){
        const li = document.createElement('li');
        li.innerHTML = `
                    <div class="view">
                    <input property="done" data-tarefa-id="${tarefa.id}" class="toggle" type="checkbox" ${tarefa.concluida ? 'checked' : ''}>
                    <label property="text">${tarefa.titulo}</label>
                    <button class="excluir" data-tarefa-id="${tarefa.id}"></button>
                    </div>
                `;
        if(tarefa.concluida){
            li.className= "completed"
            tarefasString += "[x] " + tarefa.titulo + "\n"
        }else{
            li.className= ""
            tarefasString += "[ ] " + tarefa.titulo + "\n"
        }
        tarefaList.appendChild(li);
    }

    // Função que lida com adição de nova tarefa
    adicionarTarefaForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const tarefaTitulo = tarefaTituloInput.value;
        if (tarefaTitulo) {
            fetch(`${apiUrl}/tarefa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `titulo=${tarefaTitulo}`,
            })
                .then(response => {
                    if (response.status === 200) {
                        tarefaTituloInput.value = '';
                        exibirToast("Tarefa adicionada com sucesso");
                        buscarTarefas();
                    } else if (response.status === 409) {
                        exibirToast("Tarefa com mesmo título já existe !!!");
                    }
                });
        }
    });


    // Função que lida com botao share
    share.addEventListener('click', function (e) {
        fetch(`https://textdb.dev/api/data/${myUUID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            // body: `hehe agora deu bom ihaaaaa`,
            body: `${tarefasString}`,
        })
            .then(response => {
                if (response.status === 200) {
                    navigator.clipboard.writeText(`https://textdb.dev/data/${myUUID}`);
                    exibirToast("Share Link Copiado !!!");
                    // alert("Copied the text: https://textdb.dev/data/0c1d7039-d987-4c75-8632-d0c2cbd0019d");
                } else {
                    exibirToast("Falha ao compartiljar");
                }
            });
    });

    // Filtros de Todas, Ativas e Completas
    filtroTodas.addEventListener('click', function (){
        filtro_estado_tarefa = "todas"
        buscarTarefas()
        filtroTodas.className="selecionado"
        filtroAtivas.className=""
        filtroCompletas.className=""

    });
    filtroAtivas.addEventListener('click', function (){
        filtro_estado_tarefa = "ativas"
        buscarTarefas()
        filtroTodas.className=""
        filtroAtivas.className="selecionado"
        filtroCompletas.className=""

    });
    filtroCompletas.addEventListener('click', function (){
        filtro_estado_tarefa = "completas"
        buscarTarefas()
        filtroTodas.className=""
        filtroAtivas.className=""
        filtroCompletas.className="selecionado"
    });

    // Remove todas as Concluídas
    limparConcluidas.addEventListener('click', function () {
        fetch(`${apiUrl}/tarefa/todas`)
            .then(response => response.json())
            .then(data => {
                tarefasRestantes.innerText=data.tarefas.length.toString()
                data.tarefas.forEach(tarefa => {
                    if (tarefa.concluida === true) {
                        fetch(`${apiUrl}/tarefa?id=${tarefa.id}`, {
                            method: 'DELETE'
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    exibirToast("Tarefa excluída com sucesso");
                                } else if (response.status === 404) {
                                    detalhesTarefa.innerHTML = 'Tarefa não encontrada.';
                                }
                            });
                    }
                });
                setTimeout( buscarTarefas, 200);
            });
    });

    // Marca todas como concluídas ou ativas
    marcarTodas.addEventListener('click', function () {
        fetch(`${apiUrl}/tarefa/todas`)
            .then(response => response.json())
            .then(data => {
                tarefasRestantes.innerText=data.tarefas.length.toString()
                data.tarefas.forEach(tarefa => {
                    if (tarefa.concluida === mudarTodasConcluidasPara) {
                        fetch(`${apiUrl}/tarefa/concluida?id=${tarefa.id}`, {
                            method: 'PUT'
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    exibirToast("Conclusão da tarefa modificada");
                                } else if (response.status === 404) {
                                    detalhesTarefa.innerHTML = 'Tarefa não encontrada.';
                                }
                            });
                    }
                });
                mudarTodasConcluidasPara = !mudarTodasConcluidasPara
                setTimeout( buscarTarefas, 200);
            });
    });


    // Função que lida com conclusão de uma tarefa
    tarefaList.addEventListener('click', function (e) {
        if (e.target.classList.contains('toggle')) {
            const tarefaId = e.target.getAttribute('data-tarefa-id');
            fetch(`${apiUrl}/tarefa/concluida?id=${tarefaId}`, {
                method: 'PUT'
            })
            .then(response => {
                if (response.status === 200) {
                    buscarTarefas()
                    exibirToast("Conclusão da tarefa modificada");
                } else if (response.status === 404) {
                    detalhesTarefa.innerHTML = 'Tarefa não encontrada.';
                }
            });
        }
    });


    // Função que lida com exclusão
    tarefaList.addEventListener('click', function (e) {
        if (e.target.classList.contains('excluir')) {
            const tarefaId = e.target.getAttribute('data-tarefa-id');
            fetch(`${apiUrl}/tarefa?id=${tarefaId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.status === 200) {
                    exibirToast("Tarefa excluída com sucesso");
                    buscarTarefas();
                } else if (response.status === 404) {
                    detalhesTarefa.innerHTML = 'Tarefa não encontrada.';
                }
            });
        }
    });

    // Busca inicial das tarefas
    buscarTarefas();
});
