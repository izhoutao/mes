const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  sex: state => state.user.sex,
  department: state => state.user.department,
  phone: state => state.user.phone,
  email: state => state.user.email,
  staffId: state => state.user.staffId,
  id: state => state.user.id,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
