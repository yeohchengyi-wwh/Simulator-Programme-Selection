// System Data Configuration
const db = {
  progs: ['Pure Sciences', 'Applied Sciences', 'Engineering', 'Accounting', 'Management', 'Arts'],
  progLabels: [['Pure', 'Sciences'], ['Applied', 'Sciences'], 'Engineering', 'Accounting', 'Management', 'Arts'],
  factors: ['Interest', 'Exam', 'Career', 'Location', 'Fees', 'Explore'],
  colors: ['#41f63b', '#015439', '#3e0bf5', '#f0a823', '#7b43ff', '#ff0000'],
  state: {
    rates: [
      [5, 5, 3, 3, 4, 2], [4, 5, 4, 3, 3, 3], [4, 5, 5, 2, 5, 2],
      [3, 4, 4, 4, 4, 2], [3, 3, 3, 5, 3, 3], [2, 3, 2, 4, 2, 4]
    ],
    weights: [0.30, 0.20, 0.25, 0.10, 0.10, 0.05]
  }
};

// Math Calculation Engine
const engine = {
  calc: (rates, weights) => {
    const util = rates.map(r => r.reduce((sum, val, j) => sum + val * weights[j], 0));
    const maxU = Math.max(...util);
    const exp = util.map(u => Math.exp(u - maxU));
    const sumExp = exp.reduce((a, b) => a + b, 0);
    return { util, prob: exp.map(e => e / sumExp) };
  }
};

// Exposing syncing functions globally for HTML 
window.syncW = function(idx, val, source) {
  let v = parseFloat(val) || 0;
  if(v > 1) v = 1; if(v < 0) v = 0;
  db.state.weights[idx] = v;
  if(source === 'slide') document.getElementById(`w-inp-${idx}`).value = v.toFixed(2);
  if(source === 'num') document.querySelectorAll('.weight-row input[type=range]')[idx].value = v;
  
  const total = db.state.weights.reduce((a,b)=>a+b,0);
  document.getElementById('w-total').textContent = total.toFixed(2);
  document.getElementById('w-total').style.color = Math.abs(total - 1) > 0.01 ? '#ef4444' : '#10b981';
};

window.syncR = function(pIdx, fIdx, val) {
  db.state.rates[pIdx][fIdx] = parseInt(val);
  document.getElementById(`rv-${pIdx}-${fIdx}`).textContent = val;
};

// User Interface 
function buildUI() {
  const wCont = document.getElementById('weights-container');
  wCont.innerHTML = db.factors.map((f, j) => `
    <div class="weight-row">
      <span class="w-label">${f}</span>
      <input type="range" min="0" max="1" step="0.01" value="${db.state.weights[j]}" oninput="syncW(${j}, this.value, 'slide')">
      <input type="number" class="w-num" id="w-inp-${j}" value="${db.state.weights[j].toFixed(2)}" oninput="syncW(${j}, this.value, 'num')">
    </div>
  `).join('');

  const rCont = document.getElementById('ratings-container');
  rCont.innerHTML = db.progs.map((prog, i) => `
    <div class="control-row">
      <div class="c-header">
        <div class="c-name"><div class="dot" style="background:${db.colors[i]}"></div>${prog}</div>
      </div>
      <div class="c-sliders">
        ${db.factors.map((f, j) => `
          <div class="slider-item">
            <span class="slider-label">${f}</span>
            <input type="range" min="1" max="5" step="1" value="${db.state.rates[i][j]}" oninput="syncR(${i}, ${j}, this.value)">
            <span class="slider-val" id="rv-${i}-${j}">${db.state.rates[i][j]}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  document.getElementById('btn-recalc').addEventListener('click', renderVisuals);
}

// Chart Initialization 
let instances = {};
Chart.defaults.color = '#64748b';
Chart.defaults.font.family = 'system-ui, -apple-system, sans-serif';
const gridConfig = { color: '#f1f5f9' };

function initCharts() {
  const commonScaleOptions = {
    y: { grid: { display: false } }, 
    x: { 
      grid: gridConfig,
      ticks: { 
        maxRotation: 0, 
        minRotation: 0, 
        font: { size: 10 },
        autoSkip: false,
        maxTicksLimit: 6 
      }
    }
  };

  const ctxP = document.getElementById('chartProb');
  instances.prob = new Chart(ctxP, { 
    type: 'bar', 
    data: { labels: [], datasets: [{}] }, 
    options: { 
      responsive: true, 
      maintainAspectRatio: false, 
      plugins: { 
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.raw.toFixed(1) + '%';
            }
          }
        }
      }, 
      scales: {
        y: { 
          grid: { display: false },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
        x: commonScaleOptions.x 
      }
    } 
  });
  
  const ctxU = document.getElementById('chartUtil');
  instances.util = new Chart(ctxU, { 
    type: 'bar', 
    data: { labels: [], datasets: [{}] }, 
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: commonScaleOptions } 
  });
  
  // Radar Chart Initialization
  const ctxR = document.getElementById('chartRadar');
  instances.radar = new Chart(ctxR, { 
    type: 'radar', 
    data: { 
      labels: db.factors, 
      datasets: [] 
    }, 
    options: { 
      responsive: true, 
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: gridConfig.color },
          grid: { color: gridConfig.color },
          pointLabels: { font: { size: 12, weight: '500' }, color: '#1e293b' },
          ticks: { display: false, min: 0, max: 5 } 
        }
      },
      plugins: { 
        legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, font: {size: 11} } } 
      }
    } 
  });
}

function renderVisuals() {
  const wTotal = db.state.weights.reduce((a,b)=>a+b,0);
  const wNorm = wTotal > 0 ? db.state.weights.map(w => w / wTotal) : db.state.weights;
  const { util, prob } = engine.calc(db.state.rates, wNorm);

  const bestIdx = prob.indexOf(Math.max(...prob));
  document.getElementById('win-name').textContent = db.progs[bestIdx];
  document.getElementById('win-score').textContent = (prob[bestIdx] * 100).toFixed(1) + '%';

  const sortedIdx = [...Array(6).keys()].sort((a,b) => prob[b] - prob[a]);

  // Update Bar Charts
  instances.prob.data.labels = sortedIdx.map(i => db.progLabels[i]); 
  instances.prob.data.datasets = [{
    data: sortedIdx.map(i => prob[i] * 100),
    backgroundColor: sortedIdx.map(i => db.colors[i]),
    borderRadius: 4
  }];
  instances.prob.update();

  instances.util.data.labels = sortedIdx.map(i => db.progLabels[i]);
  instances.util.data.datasets = [{
    data: sortedIdx.map(i => util[i]),
    backgroundColor: sortedIdx.map(i => db.colors[i] + '40'),
    borderColor: sortedIdx.map(i => db.colors[i]),
    borderWidth: 1.5,
    borderRadius: 4
  }];
  instances.util.update();

  // Update Radar Chart (Displaying only the Top 3 Programs to avoid clutter)
  const top3Idx = sortedIdx.slice(0, 3);
  instances.radar.data.datasets = top3Idx.map((progIdx) => {
    return {
      label: db.progs[progIdx],
      data: db.state.rates[progIdx], // Feed the raw 1-5 ratings for shape comparison
      backgroundColor: db.colors[progIdx] + '33', // 20% opacity fill
      borderColor: db.colors[progIdx],
      pointBackgroundColor: db.colors[progIdx],
      borderWidth: 2,
      pointRadius: 4
    };
  });
  instances.radar.update();

  // Update Heatmap
  const ht = document.getElementById('heatmap-body');
  ht.innerHTML = `<tr><th style="text-align:left">Programme</th>${db.factors.map(f=>`<th>${f}</th>`).join('')}<th>Score</th></tr>` + 
  db.progs.map((p, i) => {
    const rowVals = db.state.rates[i].map((r, j) => r * wNorm[j]);
    const tot = rowVals.reduce((a,b)=>a+b,0);
    const tds = rowVals.map(v => {
      const alpha = 0.05 + (v / 2) * 0.4; 
      return `<td><div class="hm-cell" style="background:rgba(59, 130, 246, ${alpha})">${v.toFixed(2)}</div></td>`;
    }).join('');
    return `<tr><td style="text-align:left; font-weight:600; color:#1e293b; display:flex; align-items:center; gap:8px;"><div class="dot" style="background:${db.colors[i]}"></div>${p}</td>${tds}<td style="font-weight:800; color:var(--accent-primary)">${tot.toFixed(2)}</td></tr>`;
  }).join('');
}

window.onload = () => {
  buildUI();
  initCharts();
  renderVisuals();
};