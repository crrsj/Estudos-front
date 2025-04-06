const categoriaSelect = document.getElementById('categoriaId');

async function carregarCategorias() {
  try {
    const response = await fetch('http://localhost:8080/categorias');
    const categorias = await response.json();
    categoriaSelect.innerHTML = '';
    categorias.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.nomeCategoria;
      categoriaSelect.appendChild(opt);
    });
  } catch (error) {
    categoriaSelect.innerHTML = '<option>Erro ao carregar</option>';
  }
}

carregarCategorias();

document.getElementById('form-categoria').addEventListener('submit', async function (e) {
  e.preventDefault();
  const nome = document.getElementById('nomeCategoria').value;
  const resposta = await fetch('http://localhost:8080/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nomeCategoria: nome })
  });
  const msg = document.getElementById('mensagemCategoria');
  if (resposta.ok) {
    msg.innerHTML = '<div class="alert alert-success">Categoria criada com sucesso!</div>';
    carregarCategorias();
    document.getElementById('form-categoria').reset();
  } else {
    msg.innerHTML = '<div class="alert alert-danger">Erro ao criar categoria.</div>';
  }
});

document.getElementById('form-tarefa').addEventListener('submit', async function (e) {
  e.preventDefault();

  const categoriaId = parseInt(document.getElementById('categoriaId').value);

  const tarefa = {
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    status: document.getElementById('status').value,
    diaSemana: document.getElementById('diaSemana').value
  };

  const resposta = await fetch(`http://localhost:8080/tarefa/${categoriaId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tarefa)
  });

  const msg = document.getElementById('mensagemTarefa');
  if (resposta.ok) {
    msg.innerHTML = '<div class="alert alert-success">Tarefa criada com sucesso!</div>';
    document.getElementById('form-tarefa').reset();
    carregarCategorias();
    carregarTarefas()
  } else {
    msg.innerHTML = '<div class="alert alert-danger">Erro ao criar tarefa.</div>';
  }
});

async function carregarTarefas() {
  try {
    const response = await fetch('http://localhost:8080/tarefa');
    const tarefas = await response.json();
    const lista = document.getElementById('lista-tarefas');
    lista.innerHTML = '';

    tarefas.forEach(tarefa => {
      const card = document.createElement('div');
      card.className = 'col';
      card.innerHTML = `
        <div class="card h-100 shadow-sm border-primary">
          <div class="card-body">
            <h5 class="card-title">${tarefa.titulo}</h5>
            <p class="card-text"><strong>Descrição:</strong> ${tarefa.descricao}</p>
            <p class="card-text"><strong>Status:</strong> ${tarefa.status}</p>
            <p class="card-text"><strong>Dia:</strong> ${tarefa.diaSemana}</p>
            <p class="card-text"><strong>Categoria:</strong> ${tarefa.categoria?.nomeCategoria || 'Sem categoria'}</p>
            <button class="btn btn-danger mt-2" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
          </div>
        </div>
      `;
      lista.appendChild(card);
    });
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
  }
}

async function excluirTarefa(id) {
  if (!confirm('Deseja realmente excluir esta tarefa?')) return;

  try {
    const response = await fetch(`http://localhost:8080/tarefa/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      carregarTarefas(); // atualiza a lista após exclusão
    } else {
      alert('Erro ao excluir a tarefa.');
    }
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    alert('Erro na conexão com o servidor.');
  }
}

carregarCategorias();
carregarTarefas(); // <-- aqui também
