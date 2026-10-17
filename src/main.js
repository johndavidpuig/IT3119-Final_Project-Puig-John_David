import { supabase } from './supabaseClient.js'
import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="container">
    <section id="loginPanel" class="panel" style="max-width:480px;margin:60px auto">
      <h1>Student Management System</h1>
      <h2>Sign In</h2>
      <p>Sign in using an account created in Supabase Authentication.</p>

      <form id="loginForm">
        <label>
          Email
          <input name="email" type="email" autocomplete="username" required />
        </label>

        <label>
          Password
          <input name="password" type="password"
            autocomplete="current-password" required />
        </label>

        <button id="loginBtn" type="submit">Sign In</button>
      </form>

      <p id="loginMessage" role="status" aria-live="polite"></p>
    </section>

    <section id="dashboard" hidden>
      <header class="page-header">
        <div>
          <h1>Student Management System</h1>
          <p>Manage student records in your database.</p>
          <p id="signedInAs"></p>
        </div>
        <div>
          <button id="refreshBtn" type="button">Refresh Records</button>
          <button id="logoutBtn" type="button">Sign Out</button>
        </div>
      </header>

      <section class="panel">
        <h2>Register Student</h2>
        <form id="studentForm">
          <div class="form-grid">
            <label>Student Number
              <input name="student_no" required />
            </label>
            <label>First Name
              <input name="first_name" required />
            </label>
            <label>Last Name
              <input name="last_name" required />
            </label>
            <label>Year Level
              <select name="year_level" required>
                <option value="">Select year level</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </label>
            <label>Email
              <input name="email" type="email" required />
            </label>
            <label>Course ID (optional)
              <input name="course_id" type="number" min="1" step="1" />
            </label>
          </div>
          <button id="submitBtn" type="submit">Add Student</button>
        </form>
        <p id="formMessage" role="status" aria-live="polite"></p>
      </section>

      <section class="panel">
        <div class="table-header">
          <div>
            <h2>Student Records</h2>
            <p id="recordCount">Loading students...</p>
          </div>
          <input id="searchInput" type="search"
            placeholder="Search students..." aria-label="Search students" />
        </div>

        <p id="tableMessage" role="status" aria-live="polite">
          Loading students...
        </p>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student No.</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Year</th>
                <th>Email</th>
                <th>Course ID</th>
                <th>Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="studentsBody"></tbody>
          </table>
        </div>
      </section>
    </section>
  </main>
`

const loginPanel = document.querySelector('#loginPanel')
const loginForm = document.querySelector('#loginForm')
const loginBtn = document.querySelector('#loginBtn')
const loginMessage = document.querySelector('#loginMessage')
const dashboard = document.querySelector('#dashboard')
const signedInAs = document.querySelector('#signedInAs')
const logoutBtn = document.querySelector('#logoutBtn')

const form = document.querySelector('#studentForm')
const submitBtn = document.querySelector('#submitBtn')
const refreshBtn = document.querySelector('#refreshBtn')
const formMessage = document.querySelector('#formMessage')
const tableMessage = document.querySelector('#tableMessage')
const recordCount = document.querySelector('#recordCount')
const studentsBody = document.querySelector('#studentsBody')
const searchInput = document.querySelector('#searchInput')

let students = []
let currentUser = null

function showFormMessage(message, isError = false) {
  formMessage.textContent = message
  formMessage.className = isError ? 'error' : 'success'
}

function showLoginMessage(message, isError = true) {
  loginMessage.textContent = message
  loginMessage.className = isError ? 'error' : 'success'
}

function showLogin() {
  currentUser = null
  students = []
  studentsBody.replaceChildren()
  recordCount.textContent = ''
  dashboard.hidden = true
  loginPanel.hidden = false
  loginForm.reset()
  loginMessage.textContent = ''
}

function showDashboard(user) {
  currentUser = user
  loginPanel.hidden = true
  dashboard.hidden = false
  signedInAs.textContent = `Signed in as ${user.email ?? 'user'}`
  loadStudents()
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault()
  loginBtn.disabled = true
  showLoginMessage('Signing in...', false)

  const formData = new FormData(loginForm)
  const email = String(formData.get('email')).trim()
  const password = String(formData.get('password'))

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    showDashboard(data.user)
  } catch (error) {
    console.error('Sign-in failed:', error)
    showLoginMessage(
      'Sign-in failed. Check your email and password, then try again.'
    )
  } finally {
    loginBtn.disabled = false
  }
})

logoutBtn.addEventListener('click', async () => {
  logoutBtn.disabled = true

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    showLogin()
  } catch (error) {
    console.error('Sign-out failed:', error)
    showFormMessage('Sign-out failed. Please try again.', true)
  } finally {
    logoutBtn.disabled = false
  }
})

function renderStudents() {
  const query = searchInput.value.trim().toLowerCase()

  const filtered = students.filter(student =>
    [
      student.student_no,
      student.first_name,
      student.last_name,
      student.email,
      student.year_level,
      student.course_id
    ].some(value =>
      String(value ?? '').toLowerCase().includes(query)
    )
  )

  recordCount.textContent =
    `${filtered.length} student${filtered.length === 1 ? '' : 's'} found`

  studentsBody.replaceChildren()

  if (filtered.length === 0) {
    tableMessage.textContent = query
      ? 'No students match your search.'
      : 'No student records found.'
    tableMessage.hidden = false
    return
  }

  tableMessage.hidden = true

  for (const student of filtered) {
    const row = document.createElement('tr')

    const values = [
      student.student_id,
      student.student_no,
      student.first_name,
      student.last_name,
      student.year_level,
      student.email,
      student.course_id ?? '—',
      student.created_at
        ? new Date(student.created_at).toLocaleDateString()
        : '—'
    ]

    for (const value of values) {
      const cell = document.createElement('td')
      cell.textContent = String(value ?? '')
      row.appendChild(cell)
    }

    const actionCell = document.createElement('td')
    const deleteButton = document.createElement('button')

    deleteButton.type = 'button'
    deleteButton.textContent = 'Delete'
    deleteButton.className = 'delete-btn'
    deleteButton.addEventListener('click', () => {
      deleteStudent(student.student_id)
    })

    actionCell.appendChild(deleteButton)
    row.appendChild(actionCell)
    studentsBody.appendChild(row)
  }
}

async function loadStudents() {
  if (!currentUser) return

  refreshBtn.disabled = true
  tableMessage.hidden = false
  tableMessage.textContent = 'Loading students...'
  recordCount.textContent = 'Loading...'

  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession()

    if (sessionError) throw sessionError

    if (!sessionData.session) {
      showLogin()
      return
    }

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('student_id', { ascending: true })

    if (error) throw error

    students = data ?? []
    renderStudents()
  } catch (error) {
    console.error('Error loading students:', error)
    students = []
    studentsBody.replaceChildren()
    recordCount.textContent = 'Unable to load records'
    tableMessage.hidden = false
    tableMessage.textContent =
      'Unable to load students. Check your database permissions.'
  } finally {
    refreshBtn.disabled = false
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault()

  submitBtn.disabled = true
  showFormMessage('Registering student...')

  const formData = new FormData(form)
  const courseValue = String(formData.get('course_id') ?? '').trim()

  const student = {
    student_no: String(formData.get('student_no')).trim(),
    first_name: String(formData.get('first_name')).trim(),
    last_name: String(formData.get('last_name')).trim(),
    year_level: Number(formData.get('year_level')),
    email: String(formData.get('email')).trim()
  }

  if (courseValue !== '') {
    student.course_id = Number(courseValue)
  }

  if (
    !student.student_no ||
    !student.first_name ||
    !student.last_name ||
    !student.email ||
    !Number.isInteger(student.year_level) ||
    student.year_level < 1 ||
    student.year_level > 5 ||
    (courseValue !== '' &&
      (!Number.isInteger(student.course_id) || student.course_id < 1))
  ) {
    showFormMessage('Please enter valid student information.', true)
    submitBtn.disabled = false
    return
  }

  try {
    const { error } = await supabase
      .from('students')
      .insert([student])

    if (error) throw error

    showFormMessage('Student registered successfully!')
    form.reset()
    await loadStudents()
  } catch (error) {
    console.error('Error registering student:', error)

    if (error.code === '23505') {
      showFormMessage(
        'That student number or email is already registered.',
        true
      )
    } else if (error.code === '23503') {
      showFormMessage('The selected course ID does not exist.', true)
    } else {
      showFormMessage(`Registration failed: ${error.message}`, true)
    }
  } finally {
    submitBtn.disabled = false
  }
})

async function deleteStudent(studentId) {
  if (!window.confirm(
    'Are you sure you want to delete this student? This cannot be undone.'
  )) return

  try {
    const { data, error } = await supabase
      .from('students')
      .delete()
      .eq('student_id', studentId)
      .select('student_id')

    if (error) throw error

    if (!data || data.length === 0) {
      throw new Error('No record was deleted. Check database permissions.')
    }

    showFormMessage('Student deleted successfully.')
    await loadStudents()
  } catch (error) {
    console.error('Error deleting student:', error)
    showFormMessage(`Delete failed: ${error.message}`, true)
  }
}

refreshBtn.addEventListener('click', loadStudents)
searchInput.addEventListener('input', renderStudents)

// Restore an existing session after a page refresh.
async function initializeApp() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error

    if (data.session?.user) {
      showDashboard(data.session.user)
    } else {
      showLogin()
    }
  } catch (error) {
    console.error('Authentication initialization failed:', error)
    showLogin()
    showLoginMessage(
      'Unable to check your session. Refresh the page and try again.'
    )
  }
}

initializeApp()

// Keep the interface in sync if the authentication session changes.
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    showLogin()
  } else if (event === 'SIGNED_IN' && session?.user) {
    showDashboard(session.user)
  }
})