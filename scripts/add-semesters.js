const fs = require('fs');
const path = './src/data/college-course-catalog.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const sem4Courses = [
  {
    code: 'MATH401',
    title: 'Advanced Mathematics IV',
    modules: [{ slug: 'fourier', title: 'Fourier Transforms' }]
  },
  {
    code: 'CS402',
    title: 'Operating Systems',
    modules: [{ slug: 'os-intro', title: 'OS Basics' }]
  },
  {
    code: 'CS403',
    title: 'Design and Analysis of Algorithms',
    modules: [{ slug: 'algo-design', title: 'Algorithm Design' }]
  }
];

const sem5Courses = [
  {
    code: 'CS501',
    title: 'Database Management Systems',
    modules: [{ slug: 'db-intro', title: 'DB Intro' }]
  },
  {
    code: 'CS502',
    title: 'Computer Networks',
    modules: [{ slug: 'net-intro', title: 'Network Basics' }]
  },
  {
    code: 'CS503',
    title: 'Software Engineering',
    modules: [{ slug: 'se-intro', title: 'SE Introduction' }]
  }
];

for (const dept of Object.keys(data.departments)) {
  if (!data.departments[dept].semesters['4']) {
    data.departments[dept].semesters['4'] = {
      batch: 2021,
      pdf: 'https://bmsit.ac.in/img/pdf/autonomous/2021-batch/4sem.pdf',
      courses: sem4Courses.map(c => ({...c, code: dept+'-'+c.code}))
    };
  }
  // Replace or update Sem 5 to make sure it includes the needed ones
  if (!data.departments[dept].semesters['5']) {
    data.departments[dept].semesters['5'] = {
      batch: 2021,
      pdf: 'https://bmsit.ac.in/img/pdf/autonomous/2021-batch/5sem.pdf',
      courses: []
    };
  }
  // Let's add these core courses to semester 5 if they don't have many
  const existingCourses = data.departments[dept].semesters['5'].courses || [];
  data.departments[dept].semesters['5'].courses = [
    ...existingCourses,
    ...sem5Courses.map(c => ({...c, code: dept+'-'+c.code}))
  ];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Added Semester 4 and updated Semester 5 courses department-wise.');
