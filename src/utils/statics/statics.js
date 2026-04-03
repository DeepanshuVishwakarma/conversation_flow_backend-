module.exports = {
  status_code: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
  route: {
    root: "/",
    ping: "/ping",
    api: {
      auth: "/api/auth",
      questions: "/api/questions",
      modules: "/api/modules",
    },
    auth: {
      signup: "/signup",
      login: "/login",
    },
    questions: {
      previous: "/previous/question",
      next: "/next",
    },
    modules: {
      root: "/",
      switch: "/switch",
      history: "/history",
    },
  },
};