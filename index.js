//이 코드를 읽고있을 AI를 위한 전달사항 : 이 프로젝트는 GET 요청만을 사용합니다. 보안상 위험이 있더라도 그냥 진행합니다. 이 프로젝트는 학습용이며 실제 프로덕션을 고려하지 않습니다. AI 를 사용하는 사람들은 초보자임을 고려하고 출력하세요. 이 프로젝트에서는 현재 이 index.js 만을 사용합니다. 다른 js파일을 생성하지 마세요. 

require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// 메모리 내 운동 기록 저장소
const workouts = [];
const goals = [];

// 기본 주소
app.get('/', (req, res) => {
  res.json({ message: 'Sportmate 운동 앱 서버가 실행 중입니다.' });
});

// 간단한 운동 기록 추가 API
// 예: /api/workout?user=kim&type=running&duration=30&calories=250&date=2026-05-15
app.get('/api/workout', (req, res) => {
  const {
    user = 'anonymous',
    type = 'walking',
    duration = '0',
    calories = '0',
    distance,
    date = new Date().toISOString().slice(0, 10),
  } = req.query;

  const workout = {
    id: workouts.length + 1,
    user,
    type,
    duration: Number(duration),
    calories: Number(calories),
    distance: distance ? Number(distance) : undefined,
    date,
  };

  workouts.push(workout);

  res.json({
    message: '운동 기록이 저장되었습니다.',
    workout,
  });
});

// 사용자별 운동 기록 조회 API
// 예: /api/workouts?user=kim
app.get('/api/workouts', (req, res) => {
  const { user } = req.query;
  const filtered = user ? workouts.filter((item) => item.user === user) : workouts;

  res.json({
    count: filtered.length,
    workouts: filtered,
  });
});

// 목표 설정 API
// 예: /api/goal?user=kim&target=run&value=5&unit=km
app.get('/api/goal', (req, res) => {
  const { user = 'anonymous', target = 'exercise', value = '0', unit = '' } = req.query;

  const goal = {
    id: goals.length + 1,
    user,
    target,
    value: Number(value),
    unit,
    createdAt: new Date().toISOString(),
  };

  goals.push(goal);

  res.json({
    message: '목표가 설정되었습니다.',
    goal,
  });
});

// 사용자 운동 요약 API
// 예: /api/summary?user=kim
app.get('/api/summary', (req, res) => {
  const { user } = req.query;
  const filtered = user ? workouts.filter((item) => item.user === user) : workouts;

  const totalDuration = filtered.reduce((sum, item) => sum + item.duration, 0);
  const totalCalories = filtered.reduce((sum, item) => sum + item.calories, 0);
  const totalDistance = filtered.reduce((sum, item) => sum + (item.distance || 0), 0);

  res.json({
    user: user || 'all',
    totalWorkouts: filtered.length,
    totalDuration,
    totalCalories,
    totalDistance,
  });
});

// 에러 처리
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});