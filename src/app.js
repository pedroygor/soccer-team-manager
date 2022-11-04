const express = require('express');

const app = express();
app.use(express.json());

let nextId = 3;
const teams = [
  {
    id: 1,
    name: 'São Paulo Futebol Clube',
    initials: 'SPF',
  },
  {
    id: 2,
    name: 'Clube Atlético Mineiro',
    initials: 'CAM',
  },
];

const validateTeam = (req, res, next) => {
  const requiredProperties = ['nome', 'sigla'];
  if (requiredProperties.every((property) => property in req.body)) {
    next(); // Chama o próximo middleware
  } else {
    res.sendStatus(400); // Ou já responde avisando que deu errado
  }
};

app.get('/', (req, res) => res.status(200).json({ message: 'Olá Mundo!' }));

app.get('/teams', (req, res) => res.status(200).json({ teams }));

app.get('/teams/:id', (req, res) => {
  const { id } = req.params;
  const teamSelected = teams.find((team) => team.id === Number(id));

  if (!teamSelected) {
    res.status(404).json({ message: 'Team Not Found!' });
  }

  res.status(200).json({ teamSelected });
});

app.post('/teams', validateTeam, (req, res) => {
  const newTeam = { id: nextId, ...req.body };
  teams.push(newTeam);
  nextId += 1;
  res.status(201).json({ team: newTeam });
});

app.put('/teams/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, initials } = req.body;

  const updateTeam = teams.find((team) => team.id === Number(id));

  if (!updateTeam) {
    res.status(404).json({ message: 'Team not found' });
  }

  updateTeam.name = name;
  updateTeam.initials = initials;
  res.status(200).json({ updateTeam });
});

app.delete('/teams/:id', (req, res) => {
  const { id } = req.params;
  const arrayPosition = teams.findIndex((team) => team.id === Number(id));
  teams.splice(arrayPosition, 1);

  res.status(200).end();
});

module.exports = app;