const app = document.getElementById('app');

const codeMap = {
  'L': '1', 'U': '2', 'W': '3', 'A': '4', 'K': '5',
  'T': '6', 'I': '7', 'G': '8', 'E': '9', 'R': '0'
};

let tangkaiCode = '';
let lensaCode = '';
let leftStrength = '';
let rightStrength = '';
let currentSide = 'R';
let lensType = '';
let jenisLensa = '';
let currentStep = 1;

function renderStep() {
  app.innerHTML = '';
  const section = document.createElement('div');
  section.className = 'input-section';

  if (currentStep === 1) {
    section.innerHTML = '<h2>Masukkan Kode Tangkai</h2>';
    section.appendChild(makeDisplay('tangkaiDisplay', tangkaiCode));
    section.appendChild(createButtonGrid('tangkai'));
    section.appendChild(wrapNextButton());
  } else if (currentStep === 2) {
    section.innerHTML = '<h2>Masukkan Kode Lensa</h2>';
    section.appendChild(makeDisplay('lensaDisplay', lensaCode));
    section.appendChild(createButtonGrid('lensa'));
    section.appendChild(wrapNextButton());
  } else if (currentStep === 3) {
    section.innerHTML = '<h2>Pilih Jenis Lensa</h2>';
    section.appendChild(makeDisplay('jenisLensaDisplay', jenisLensa));
    section.appendChild(createJenisLensaOptions());
    section.appendChild(wrapNextButton());
  } else if (currentStep === 4) {
    section.innerHTML = '<h2>Masukkan Minus/Plus Lensa</h2>';
    section.appendChild(makeDisplay('strengthDisplay', `R: ${rightStrength} | L: ${leftStrength}`));
    section.appendChild(createSideSelector());
    section.appendChild(createNumberPad());
    const totalBtn = document.createElement('button');
    totalBtn.textContent = 'Totalkan';
    totalBtn.onclick = calculateTotal;
    section.appendChild(totalBtn);
  }

  app.appendChild(section);
}

function makeDisplay(id, content) {
  const div = document.createElement('div');
  div.id = id;
  div.textContent = content;
  return div;
}

function createButtonGrid(type) {
  const grid = document.createElement('div');
  grid.className = 'button-grid';
  Object.keys(codeMap).forEach(letter => {
    const btn = document.createElement('button');
    btn.textContent = letter;
    btn.onclick = () => {
      if (type === 'tangkai') {
        tangkaiCode += letter;
        document.getElementById('tangkaiDisplay').textContent = tangkaiCode;
      } else {
        lensaCode += letter;
        document.getElementById('lensaDisplay').textContent = lensaCode;
      }
    };
    grid.appendChild(btn);
  });

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.onclick = () => {
    if (type === 'tangkai') {
      tangkaiCode = tangkaiCode.slice(0, -1);
      document.getElementById('tangkaiDisplay').textContent = tangkaiCode;
    } else {
      lensaCode = lensaCode.slice(0, -1);
      document.getElementById('lensaDisplay').textContent = lensaCode;
    }
  };
  grid.appendChild(delBtn);

  return grid;
}

function createJenisLensaOptions() {
  const options = [
    'cr mc putih', 'cr mc blue ray', 'cr mc photogrey', 'cr mc blue chromix',
    'cr mc putih bifocal', 'cr mc blueray bifocal', 'cr mc putih progresive',
    'cr mc progresive blueray', 'cr mc photogrey progresive', 'cr mc blue chromix progresive',
    'cr mc blue chromix onedrive', 'cr mc progresive blue chromix onedrive'
  ];

  const container = document.createElement('div');
  container.className = 'button-grid';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => {
      jenisLensa = opt;
      document.getElementById('jenisLensaDisplay').textContent = jenisLensa;
    };
    container.appendChild(btn);
  });

  return container;
}

function createSideSelector() {
  const grid = document.createElement('div');
  grid.className = 'button-grid';
  ['R', 'L'].forEach(side => {
    const btn = document.createElement('button');
    btn.textContent = `${side}`;
    btn.onclick = () => {
      currentSide = side;
    };
    grid.appendChild(btn);
  });
  return grid;
}

function createNumberPad() {
  const grid = document.createElement('div');
  grid.className = 'button-grid';

  const special = ['+', '-', '.', 'Delete'];
  special.forEach(symbol => {
    const btn = document.createElement('button');
    btn.textContent = symbol;
    btn.onclick = () => {
      let currentValue = currentSide === 'R' ? rightStrength : leftStrength;

      if (symbol === '+' || symbol === '-') {
        lensType = symbol === '+' ? 'Plus' : 'Minus';
        currentValue = currentValue.replace(/^[-+]?/, symbol);
      } else if (symbol === '.') {
        if (!currentValue.includes('.')) currentValue += '.';
      } else {
        currentValue = currentValue.slice(0, -1);
      }

      if (currentSide === 'R') {
        rightStrength = currentValue;
      } else {
        leftStrength = currentValue;
      }

      document.getElementById('strengthDisplay').textContent = `R: ${rightStrength} | L: ${leftStrength}`;
    };
    grid.appendChild(btn);
  });

  [...Array(10).keys()].forEach(num => {
    const btn = document.createElement('button');
    btn.textContent = num;
    btn.onclick = () => {
      if (currentSide === 'R') {
        rightStrength += num;
      } else {
        leftStrength += num;
      }
      document.getElementById('strengthDisplay').textContent = `R: ${rightStrength} | L: ${leftStrength}`;
    };
    grid.appendChild(btn);
  });

  return grid;
}

function wrapNextButton() {
  const container = document.createElement('div');
  container.className = 'next-button-container';
  const btn = document.createElement('button');
  btn.textContent = 'Lanjut';
  btn.onclick = () => {
    currentStep++;
    renderStep();
  };
  container.appendChild(btn);
  return container;
}

function calculateTotal() {
  const tangkaiPrice = parseInt(tangkaiCode.split('').map(c => codeMap[c] || '').join('')) * 1000 || 0;
  const lensaBasePrice = parseInt(lensaCode.split('').map(c => codeMap[c] || '').join('')) * 1000 || 0;

  const left = parseFloat(leftStrength) || 0;
  const right = parseFloat(rightStrength) || 0;
  const max = Math.max(Math.abs(left), Math.abs(right));
  const tambahan = max > 4 ? 50000 : 0;

  const lensaTotal = lensaBasePrice + tambahan;
  const total = tangkaiPrice + lensaTotal;

  displayResult(tangkaiPrice, tangkaiCode, lensaBasePrice, tambahan, lensaCode, left, right, total);
}

function displayResult(tangkaiPrice, tangkaiKode, lensaBase, tambahan, lensaKode, kiri, kanan, total) {
  app.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'result';
  div.id = 'resultDiv';

  const simbol = lensType === 'Minus' ? '-' : '+';

  div.innerHTML = `
    <p><strong>Harga Tangkai:</strong> Rp ${tangkaiPrice.toLocaleString()} (${tangkaiKode})</p>
    <p><strong>Harga Lensa:</strong> Rp ${lensaBase.toLocaleString()} (${lensaKode})</p>
    <p><strong>Jenis Lensa:</strong> ${jenisLensa}</p>
    <p><strong>Minus/Plus:</strong> R: ${rightStrength} | L: ${leftStrength}</p>
    <p><strong>Diskon:</strong> <span id="diskonVal">0%</span></p>
    <label>Atur Diskon (0-20%): <input id="diskonInput" type="number" min="0" max="20" value="0"></label>
  `;

  const totalElem = document.createElement('h2');
  totalElem.innerHTML = `Total Transaksi: Rp ${total.toLocaleString()}`;
  div.appendChild(totalElem);

  const inputDiskon = div.querySelector('#diskonInput');
  inputDiskon.addEventListener('input', () => {
    const d = parseInt(inputDiskon.value) || 0;
    const after = Math.round(total - (total * d / 100));
    document.getElementById('diskonVal').textContent = `${d}%`;
    totalElem.innerHTML = `Total Transaksi: Rp ${after.toLocaleString()}`;
  });

  const actions = document.createElement('div');
  actions.className = 'actions';

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Kembali ke Awal';
  backBtn.onclick = () => {
    tangkaiCode = '';
    lensaCode = '';
    leftStrength = '';
    rightStrength = '';
    lensType = '';
    jenisLensa = '';
    currentStep = 1;
    renderStep();
  };

  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Download Gambar';
  downloadBtn.onclick = () => {
    html2canvas(document.getElementById('resultDiv')).then(canvas => {
      const link = document.createElement('a');
      link.download = 'pembayaran-optik.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  actions.appendChild(backBtn);
  actions.appendChild(downloadBtn);
  app.appendChild(div);
  app.appendChild(actions);
}

renderStep();