'use client'

import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Task {
  _id: string,
  title: string,
  description: string,
  duedate: string,
  priority: string,
  status: string
  completed?: boolean
}

interface Member {
  _id: string,
  name: string,
  email?: string,
  tasks?: Task[]
}

interface TeamType {
  _id: string;
  name: string;
  members: Member[];
}

export default function DashBoard() {
  const router = useRouter()
  const [user, setUser] = useState({ name: "", username: "", email: "" })
  const [task, setTask] = useState({ title: "", description: "", priority: "", duedate: "", status: "" })
  const [loggedIn, setLoggedIn] = useState(true)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState("Create")
  const [tasks, setTasks] = useState<Task[]>([])
  const [teams, setTeams] = useState<TeamType[]>([])
  const [createTeam, setCreateTeam] = useState(false)
  const [teamname, setTeamName] = useState("")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<TeamType | null>(null)
  const [assignTask, setAssignTask] = useState("")
  const [invite, setInvite] = useState(true)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get('/api/users/checkLoggedIn')
        setLoggedIn(response.data.loggedIn)
        setUser(response.data.user)
      } catch (error) {
        console.error(error);
        setLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
    displayTasks()
    displayTeams()
  }, [])

  const createTask = async () => {
    try {
      await axios.post('/api/users/task/create', { ...task })
      displayTasks()
      setTask({ title: "", description: "", priority: "", duedate: "", status: "" })
    } catch (error) {
      console.error("Error", error)
    }
  }

  const displayTasks = async () => {
    try {
      const response = await axios.get('/api/users/task/display')
      setTasks(response.data.tasks)
    } catch (error) {
      console.error(error)
    }
  }

  const displayTeams = async () => {
    try {
      const response = await axios.get('/api/users/team/display')
      setTeams(response.data.teams)
    } catch (error) {
      console.error(error)
    }
  }

  const renderContent = () => {
    switch (selected) {
      case "Create":
        return (
          <div className="bg-gray-800 p-4 sm:p-6 rounded shadow-md w-full max-w-md mx-auto space-y-4 text-gray-200 text-sm sm:text-base">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Create Task</h2>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-300">Title</label>
              <input
                type="text"
                placeholder="Enter task title"
                className="p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-300">Description</label>
              <textarea
                placeholder="Enter task description"
                rows={3}
                className="p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-300">Priority</label>
              <select
                className="p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
              >
                <option value="" disabled>Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-300">Status</label>
              <select
                className="p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={task.status}
                onChange={(e) => setTask({ ...task, status: e.target.value })}
              >
                <option value="" disabled>Select status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-300">Due Date</label>
              <input
                type="date"
                className="p-2 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={task.duedate}
                onChange={(e) => setTask({ ...task, duedate: e.target.value })}
              />
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition text-sm sm:text-base"
              onClick={createTask}
            >
              Create Task
            </button>
          </div>
        )

      case "Display":
        return (
          <div className="space-y-3">
            {tasks?.map((task) => (
              <div key={task._id} className="p-3 sm:p-4 bg-gray-700 rounded text-sm sm:text-base">
                <p className="font-semibold text-base sm:text-lg">{task.title}</p>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <p>Priority: {task.priority}</p>
                <button
                  className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm"
                  onClick={async () => {
                    try {
                      await axios.post("/api/users/task/delete", { taskId: task._id })
                      setTasks(prev => prev?.filter(t => t._id !== task._id))
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )

      case "Team":
        return (
          <div className="space-y-3 text-sm sm:text-base">
            <button
              className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setCreateTeam(true)}
            >
              + Create Team
            </button>

            <div className="space-y-3">
              {teams?.length ? (
                teams.map(team => (
                  <div key={team._id} className="p-3 sm:p-4 bg-gray-700 rounded">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <p className="font-semibold text-gray-200">{team.name}</p>
                      <button
                        className="text-xs sm:text-sm px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                        onClick={() => {
                          setInvite(true)
                          setSelectedTeam(team)
                          setEmail("")
                        }}
                      >
                        + Invite
                      </button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {team.members?.map(member => (
                        <div key={member._id} className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <p>{member.name}</p>
                            <div>
                              {!member.tasks?.length ? (
                                <button
                                  className="px-2 py-1 text-xs sm:text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                  onClick={() => { setSelectedMember(member); setSelectedTeam(team); setAssignTask(""); }}
                                >
                                  + Assign Task
                                </button>
                              ) : null}
                            </div>
                          </div>
                          {member.tasks?.length ? (
                            <div className="mt-1 space-y-1">
                              {member.tasks.map((t, idx) => (
                                <div key={t._id || idx} className="flex items-center space-x-2">
                                  <p className={`text-xs sm:text-sm text-gray-300 ${t.completed ? "line-through" : ""}`}>
                                    {t.description}
                                  </p>
                                  <button
                                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                                    onClick={() => {
                                      setTeams(prev =>
                                        prev?.map(tm => {
                                          if (tm._id !== team._id) return tm
                                          return {
                                            ...tm,
                                            members: tm.members.map(m => {
                                              if (m._id !== member._id) return m
                                              return {
                                                ...m,
                                                tasks: m.tasks?.map(task => {
                                                  if (task._id !== t._id) return task
                                                  return { ...task, completed: !task.completed }
                                                }),
                                              }
                                            }),
                                          }
                                        })
                                      )
                                    }}
                                  >
                                    {t.completed ? "Completed" : "Mark Complete"}
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : <p className="text-gray-400 mt-2">No teams yet.</p>}
            </div>
          </div>
        )

      default:
        return <p className="text-gray-200">Welcome!</p>
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout')
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen bg-gray-900 text-gray-200">
      {loading ? (
        <p className="m-auto text-gray-400 text-lg">Loading...</p>
      ) : loggedIn ? (
        <>
          {/* Sidebar */}
          <div className="w-full md:w-1/4 p-4 sm:p-6 flex flex-col bg-gray-800 shadow-lg">
            <div className="mb-6">
              <p className="text-base sm:text-xl font-semibold">{user.name}</p>
              <p className="text-xs sm:text-sm text-gray-400">{user.email}</p>
              <hr className="my-4 border-gray-600" />
            </div>

            {["Create", "Display", "Team"].map(item => (
              <button
                key={item}
                className={`text-left px-3 py-2 sm:px-4 sm:py-2 mb-2 rounded text-sm sm:text-base transition-colors ${selected === item ? "bg-blue-600 text-white font-semibold" : "text-gray-200 hover:bg-gray-700"}`}
                onClick={() => setSelected(item)}
              >
                {item}
              </button>
            ))}

            <button
              className="mt-auto px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm sm:text-base"
              onClick={() => { handleLogout(); setLoggedIn(false) }}
            >
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">{selected}</h2>
            <div className="bg-gray-800 p-4 sm:p-6 rounded shadow">
              {renderContent()}
            </div>
          </div>
        </>
      ) : (
        <p className="m-auto text-gray-400 text-lg">Login first please...</p>
      )}
    </div>
  )
}
