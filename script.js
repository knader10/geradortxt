let camposCriados = [];
let campoSelecionado = null;

document.getElementById('novoCampo').addEventListener('click', function () {
    const camposDiv = document.getElementById('campos');
    const novoCampo = document.createElement('div');
    novoCampo.className = 'campo';
    novoCampo.innerHTML = `
        <input type="text" placeholder="Nome do Campo" class="nomeCampo">
        <input type="number" placeholder="A partir" class="deCampo">
        <input type="number" placeholder="Tamanho" class="tamanhoCampo">
        <button class="excluirCampo">Excluir</button>
    `;
    camposDiv.appendChild(novoCampo);
    atualizarFormularioPreenchimento();
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('excluirCampo')) {
        event.target.parentElement.remove();
        atualizarFormularioPreenchimento();
    } else if (event.target.closest('.campo')) {
        // Abre a aba ao clicar em qualquer parte do campo
        selecionarCampo(event.target.closest('.campo'));
    }
});

document.getElementById('toggleAba').addEventListener('click', function () {
    const abaContent = document.getElementById('abaContent');
    const seta = document.querySelector('.aba-header .seta');
    abaContent.classList.toggle('hidden');
    seta.textContent = abaContent.classList.contains('hidden') ? '▶' : '▼';
});

function selecionarCampo(campo) {
    // Remove a seleção de todos os campos
    document.querySelectorAll('.campo').forEach(c => c.classList.remove('selecionado'));

    // Adiciona a seleção ao campo clicado
    campo.classList.add('selecionado');
    campoSelecionado = campo;

    const nome = campo.querySelector('.nomeCampo').value;
    const de = campo.querySelector('.deCampo').value;
    const tamanho = campo.querySelector('.tamanhoCampo').value;

    const formulario = document.getElementById('formularioPreenchimento');
    formulario.innerHTML = `
        <h3>Preencher ${nome}</h3>
        <textarea placeholder="Digite ou cole os valores para ${nome} (um por linha)"></textarea>
    `;

    // Vincula o textarea ao campo selecionado
    const textarea = formulario.querySelector('textarea');
    textarea.value = campo.dataset.valor || ''; // Recupera o valor salvo, se existir

    // Salva o valor digitado no campo ao alterar o textarea
    textarea.addEventListener('input', function () {
        campo.dataset.valor = textarea.value;
    });

    document.getElementById('abaContent').classList.remove('hidden');
}

function atualizarFormularioPreenchimento() {
    const campos = document.querySelectorAll('.campo');
    const botaoGerar = document.getElementById('gerarTxt');
    const botaoPreview = document.getElementById('previewTxt');
    botaoGerar.disabled = campos.length === 0;
    botaoPreview.disabled = campos.length === 0;
}

document.getElementById('previewTxt').addEventListener('click', function () {
    const previewContent = document.getElementById('previewTxtContent');
    const campos = document.querySelectorAll('.campo');
    let conteudoTxt = '';

    // Verifica se todos os campos têm o mesmo número de linhas
    const valoresPorCampo = Array.from(campos).map(campo => {
        return (campo.dataset.valor || '').split('\n');
    });

    const numLinhas = valoresPorCampo[0].length;

    // Gera uma linha por registro
    for (let i = 0; i < numLinhas; i++) {
        let linha = '';
        let posicaoAtual = 1;

        campos.forEach((campo, index) => {
            const de = parseInt(campo.querySelector('.deCampo').value);
            const tamanho = parseInt(campo.querySelector('.tamanhoCampo').value);
            const ate = de + tamanho - 1; // Calcula a posição final
            const valor = valoresPorCampo[index][i] || ''; // Valor da linha atual

            // Preenche os espaços entre os campos com 'X'
            if (posicaoAtual < de) {
                linha += 'X'.repeat(de - posicaoAtual);
                posicaoAtual = de;
            }

            // Preenche o valor nas posições corretas
            const valorFormatado = valor.padEnd(tamanho, ' ').substring(0, tamanho);
            linha += valorFormatado;
            posicaoAtual = ate + 1;
        });

        conteudoTxt += linha + '\n'; // Adiciona uma quebra de linha ao final de cada registro
    }

    previewContent.textContent = conteudoTxt;
    document.getElementById('previewContainer').classList.remove('hidden');
});

document.getElementById('gerarTxt').addEventListener('click', function () {
    const campos = document.querySelectorAll('.campo');
    let conteudoTxt = '';

    // Verifica se todos os campos têm o mesmo número de linhas
    const valoresPorCampo = Array.from(campos).map(campo => {
        return (campo.dataset.valor || '').split('\n');
    });

    const numLinhas = valoresPorCampo[0].length;

    // Gera uma linha por registro
    for (let i = 0; i < numLinhas; i++) {
        let linha = '';
        let posicaoAtual = 1;

        campos.forEach((campo, index) => {
            const de = parseInt(campo.querySelector('.deCampo').value);
            const tamanho = parseInt(campo.querySelector('.tamanhoCampo').value);
            const ate = de + tamanho - 1; // Calcula a posição final
            const valor = valoresPorCampo[index][i] || ''; // Valor da linha atual

            // Preenche os espaços entre os campos com 'X'
            if (posicaoAtual < de) {
                linha += 'X'.repeat(de - posicaoAtual);
                posicaoAtual = de;
            }

            // Preenche o valor nas posições corretas
            const valorFormatado = valor.padEnd(tamanho, ' ').substring(0, tamanho);
            linha += valorFormatado;
            posicaoAtual = ate + 1;
        });

        conteudoTxt += linha + '\n'; // Adiciona uma quebra de linha ao final de cada registro
    }

    if (conteudoTxt) {
        const blob = new Blob([conteudoTxt], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'arquivo.txt';
        link.click();
    }
});