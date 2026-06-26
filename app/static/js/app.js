const ROUTES = {
  admin: {
    stats: { html: '/static/admin/sections/stats.html' },
    users: { html: '/static/admin/sections/users.html' },
    departments: { html: '/static/admin/sections/departments.html' },
    sessions: { html: '/static/admin/sections/sessions.html' },
    'live-feed': { html: '/static/admin/sections/live-feed.html' },
  },
  lecturer: {
    'new-session': { html: '/static/lecturer/sections/new-session.html' },
    'live-feed': { html: '/static/lecturer/sections/live-feed.html' },
    'my-sessions': { html: '/static/lecturer/sections/my-sessions.html' },
  },
  student: {
    'my-attendance': { html: '/static/student/sections/my-attendance.html' },
    'my-schedule': { html: '/static/student/sections/my-schedule.html' },
  },
}

const APP = {
  token: null,
  user: null,
  role: null,
  page: null,

  init(page) {
    this.token = localStorage.getItem('st_token')
    try {
      this.user = JSON.parse(localStorage.getItem('st_user') || 'null')
    } catch {
      this.user = null
    }
    this.role = this.user?.role || null
    this.page = page

    if (!this.token || !this.user) {
      window.location.href = '/login.html'
      return
    }
    this.renderUserInfo()
    this.loadSection(this.getDefaultSection())
  },

  getDefaultSection() {
    return { admin: 'stats', lecturer: 'new-session', student: 'my-attendance' }[this.role] || ''
  },

  async loadSection(name) {
    const route = ROUTES[this.page]?.[name]
    if (!route) return

    const res = await fetch(route.html)
    if (!res.ok) return
    const html = await res.text()
    const content = document.getElementById('content')
    content.innerHTML = html

    content.querySelectorAll('script').forEach(s => {
      const ns = document.createElement('script')
      ns.textContent = s.textContent
      s.replaceWith(ns)
    })

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'))
    const activeEl = document.querySelector(`[data-section="${name}"]`)
    if (activeEl) activeEl.classList.add('active')
  },

  async api(path, options = {}) {
    const headers = { ...options.headers }
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`
    try {
      const res = await fetch(path, { ...options, headers })
      if (res.status === 401) { this.logout(); return null }
      return res.json()
    } catch {
      return null
    }
  },

  logout() {
    localStorage.removeItem('st_token')
    localStorage.removeItem('st_user')
    window.location.href = '/login.html'
  },

  toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('-translate-x-full')
    document.getElementById('backdrop')?.classList.toggle('hidden')
    document.body.classList.toggle('sidebar-open')
  },

  renderUserInfo() {
    const el = document.getElementById('user-name')
    if (el) el.textContent = this.user?.name || ''
    const el2 = document.getElementById('user-info-name')
    if (el2) el2.textContent = this.user?.name || ''
    const el3 = document.getElementById('user-info-email')
    if (el3) el3.textContent = this.user?.email || ''
  },
}
