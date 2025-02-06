let lastManualField = null;

document.getElementById('calculate-button').addEventListener('click', () => {
  calculateManualInput();
});

document.getElementById('distance').addEventListener('input', () => {
  lastManualField = 'distance';
  calculatePaceAutomatically();
});

document.getElementById('time').addEventListener('input', () => {
  lastManualField = 'time';
  calculatePaceAutomatically();
});

document.getElementById('speed').addEventListener('input', () => {
  lastManualField = 'speed';
});

document.getElementById('pace').addEventListener('input', () => {
  lastManualField = 'pace';
});

function updateLabels() {
  const unit = document.getElementById('unit').value;
  document.getElementById('speed-label').textContent = unit === 'km' ? 'Tempo (in km/h)' : 'Tempo (in mi/h)';
  document.getElementById('pace-label').textContent = unit === 'km' ? 'Tempo (min/km)' : 'Tempo (min/mi)';
}

function calculatePaceAutomatically() {
  const distance = parseFloat(document.getElementById('distance').value);
  const timeStr = document.getElementById('time').value;

  if (distance && timeStr) {
    const time = parseTime(timeStr);
    const pace = time / distance;
    const speed = (distance / (time / 3600)).toFixed(2);

    if (lastManualField !== 'pace') {
      document.getElementById('pace').value = formatPace(Math.round(pace));
    }

    if (lastManualField !== 'speed') {
      document.getElementById('speed').value = speed;
    }

    updateRaceTimes(pace);
  }
}

function calculateManualInput() {
  const distance = parseFloat(document.getElementById('distance').value);
  const speed = parseFloat(document.getElementById('speed').value);
  const paceStr = document.getElementById('pace').value;

  let time, pace;

  if (lastManualField === 'speed' && distance && speed) {
    time = (distance / speed) * 3600;
    pace = time / distance;
    document.getElementById('time').value = formatTime(Math.round(time));
    document.getElementById('pace').value = formatPace(Math.round(pace));
  } else if (lastManualField === 'pace' && distance && paceStr) {
    pace = parsePace(paceStr);
    time = pace * distance;
    document.getElementById('time').value = formatTime(Math.round(time));
    document.getElementById('speed').value = (distance / (time / 3600)).toFixed(2);
  }

  if (pace) {
    updateRaceTimes(pace);
  }
}

function updateRaceTimes(pace) {
  const unit = document.getElementById('unit').value;
  const raceDistances = {
    '5 km': unit === 'km' ? 5 : 5 * 0.621371,
    '10 km': unit === 'km' ? 10 : 10 * 0.621371,
    'Halbmarathon': unit === 'km' ? 21.0975 : 21.0975 * 0.621371,
    'Marathon': unit === 'km' ? 42.195 : 42.195 * 0.621371
  };

  let resultHtml = `<h3>Renndauer für populäre Distanzen:</h3>`;

  for (const [race, dist] of Object.entries(raceDistances)) {
    const raceTime = formatTime(Math.round(pace * dist));
    resultHtml += `<p><span class="distance">${race}:</span> <span class="time">${raceTime}</span></p>`;
  }

  document.getElementById('results').innerHTML = resultHtml;
}

function parseTime(timeStr) {
  const parts = timeStr.split(':').map(Number);
  return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
}

function parsePace(paceStr) {
  const parts = paceStr.split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatPace(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}