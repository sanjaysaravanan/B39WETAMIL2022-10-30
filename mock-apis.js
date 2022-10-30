// READ --> GET ( Get all jobs )
const API_URL = 'https://635cfdd2cb6cf98e56aa3f34.mockapi.io/jobs';

let formOperation = 'ADD';
let loadedJobId = null;

const closeForm = () => {
  formOperation = 'ADD';
  loadedJobId = null;
  document.getElementById('form-title').innerText = 'Add Job';
  document.getElementById('form-submit').innerText = 'Create Job';
}

const tBody = document.querySelector('tbody');
const jobForm = document.getElementById('job-form');

const closeXBtn = document.getElementById('close-cross-btn');
closeXBtn.addEventListener('click', closeForm);
const closeBtn = document.getElementById('close-btn');
closeBtn.addEventListener('click', closeForm);

// Delete ---> DELETE ( delete a data )
const deleteJob = async (jobId) => {
  const response = await fetch(
    `${API_URL}/${jobId}`,
    {
      method: 'DELETE'
    }
  );
  await response.json();
  const jobRow = document.getElementById(`${jobId}`);
  tBody.removeChild(jobRow);
};

const createJobRow = (job, edit = false) => {
  const jobRow = document.createElement('tr');

  jobRow.id = job.id;

  const idTd = document.createElement('td');
  idTd.innerText = job.id;
  const titleTd = document.createElement('td');
  titleTd.innerText = job.title;
  const postedTd = document.createElement('td');
  postedTd.innerText = job.postedAt;

  const actionsTd = document.createElement('td');

  // Action Buttons
  const editButton = document.createElement('button');
  editButton.setAttribute('class', 'btn btn-warning m-1');
  editButton.innerText = 'Edit';

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('class', 'btn btn-danger m-1');
  deleteButton.innerText = 'Delete';

  actionsTd.append(editButton, deleteButton);

  if (edit) {
    const existingRow = document.getElementById(job.id);
    existingRow.innerHTML = '';
    existingRow.append(idTd, titleTd, postedTd, actionsTd);
  } else {
    jobRow.append(idTd, titleTd, postedTd, actionsTd);
    tBody.appendChild(jobRow);
  }

  editButton.addEventListener('click', () => {
    document.getElementById('add-job').click();
    formOperation = 'EDIT';
    loadedJobId = `${job.id}`;
    document.getElementById('title').value = job.title;
    document.getElementById('posted-at').value = job.postedAt;
    document.getElementById('form-title').innerText = 'Edit Job';
    document.getElementById('form-submit').innerText = 'Edit Job';
  });

  deleteButton.addEventListener('click', () => {
    deleteJob(job.id);
  });
}

const getAllJobs = async () => {
  const response = await fetch(API_URL);
  const jobs = await response.json();

  jobs.forEach((job) => {
    createJobRow(job);
  });
}

// READ ---> Get One ( get one job detail )
const getIndividualJob = async (jobId) => {
  const response = await fetch(`${API_URL}/${jobId}`);
  const job = await response.json();
  console.log(job);
}

// Create --> POST ( Create a new Job )
const createJob = async (newJobInfo) => {
  const response = await fetch(
    API_URL,
    {
      method: 'POST',
      body: JSON.stringify(newJobInfo),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
  );
  const createdJobResponse = await response.json();
  createJobRow(createdJobResponse);

  jobForm.reset();
  closeBtn.click();
}

// Update ---> PUT ( Edit a data )
const editJob = async (newJobInfo, jobId) => {
  const response = await fetch(
    `${API_URL}/${jobId}`,
    {
      method: 'PUT',
      body: JSON.stringify(newJobInfo),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
  );
  const editedJobResponse = await response.json();

  createJobRow(editedJobResponse, true);

  jobForm.reset();
  closeBtn.click();
}

window.addEventListener('DOMContentLoaded', () => {
  getAllJobs();
});

jobForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let data = {};

  Array.from(e.target.elements).forEach((element) => {
    if (element.nodeName === 'INPUT') {
      data[element.name] = element.value;
    }
  });
  if (formOperation === 'ADD')
    createJob(data);
  else if (formOperation === 'EDIT')
    editJob(data, loadedJobId);
});
