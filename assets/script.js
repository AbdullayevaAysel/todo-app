$(document).ready(function () {
  $("body").attr("thema", localStorage.getItem("thema"))

  $("#toggle-dark").on("click", function () {
    $("body").attr("thema", (_, attr) => (attr == "dark" ? "light" : "dark"))
    localStorage.setItem("thema", $("body").attr("thema"))
  })

  const calcCount = (el) => {
    $("#list-count").html(el.find(".list-item:not(.delete)").length)
  }

  function getEl(el) {
    $(el).on("click", function () {
      let li = $(this).closest("li")
      if ($(this).hasClass("compileted-btn")) {
        $(this).removeClass("compileted-btn")
        $(li).removeClass("compileted")

        // notification
        notification($(li).find("span").text(), "active oldu", "")
      } else {
        $(this).addClass("compileted-btn")
        $(li).addClass("compileted")

        // notification
        notification($(li).find("span").text(), "compileted oldu", "")
      }
      updateTodoObject($(li).attr("key"))
    })
  }

  function removeEl(el, val) {
    $(el).on("click", function () {
      let li = el.closest("li")
      if (li.hasClass("delete")) {
        $(this).closest("li").remove()

        hardDeleteFromLocalStorage($(this).closest("li").attr("key"))
        notification(val, `todo her yerden silindi`, "")
        calcCount($(".lists"))
      } else {
        $(li).addClass("delete")
        notification(val, `todo silindi`, "")

        removeTodoObject(el.closest("li").attr("key"))
        calcCount($(".lists"))
        filterAllTodo()
      }
    })
  }

  let parseData = localStorage.getItem("todos")

  let count =
    parseData !== null && JSON.parse(parseData).length > 0
      ? Math.max(...$.map(JSON.parse(parseData), (item) => item.id))
      : 0

  const addTodo = (val) => {
    let li = $(`
    <li key=${count + 1} class="list-item" draggable="true">
      <div>
        <button type="button" class="check">
          <img src="./images/icon-check.svg" alt="">
        </button>
        <span>${val}</span>
      </div>

      <div>
        <img class="remove" src="./images/icon-cross.svg" alt="">
        <img class="recycle-btn" src="./images/rotate.svg" alt="">
      </div>
    </li>
    `)
    $(".lists").prepend($(li))
    getEl($(li).find(".check"))
    removeEl($(li).find(".remove"), val)
    recycleTodo($(li).find(".recycle-btn"), val, recycleFilter)
    calcCount($(".lists"))
  }

  function notification(value, text, icon) {
    let div = $(`
    <div class="toast">
      <div class="notification-item">
        <i class="text">${value}</i> <span> ${text}</span>
      </div>
    </div>
    `)
    $(".notification").append(div)

    let count = 10
    const interval = setInterval(() => {
      if (count <= 100) {
        $(div).css("--width", `${count}%`)
        count += 30
      } else {
        clearInterval(interval)
        $(div).remove()
      }
    }, 700)
  }

  let i = 0
  const callAddTodo = (input, e) => {
    e.preventDefault()
    let val = $(input).val().trim()
    if (val !== "") {
      addTodo(val, i)
      notification(val, `elave olundu`, "+")
      addTodoToObject(val)
      $(input).val("")
      i++
    }
  }

  $("#input").on("keypress", function (e) {
    if (e.key === "Enter") {
      callAddTodo($(this), e)
    }
  })

  $("#btn-submit").on("click", function (e) {
    callAddTodo($("#input"), e)
  })

  //filter
  function addActive(el) {
    let filters_el = $(".lists-footer").find("[data-filter]")
    filters_el.each(function () {
      $(this).removeClass("active")
    })
    el.addClass("active")
  }

  $('[data-filter="all"]').on("click", function (e) {
    filterAllTodo()
    addActive($(this))
  })

  function filterAllTodo() {
    $(".lists li.delete").css({ display: "none" })
    $(".lists li:not(.delete)").css({ display: "flex" })
    $(".lists li .recycle-btn").css({ display: "none" })
  }

  $('[data-filter="active"]').on("click", function (e) {
    $(".lists li.compileted").css({ display: "none" })
    $(".lists li:not(.compileted)").css({ display: "flex" })
    $(".lists li.delete").css({ display: "none" })
    $(".lists li .recycle-btn").css({ display: "none" })
    addActive($(this))
  })

  $('[data-filter="completed"]').on("click", function (e) {
    $(".lists li:not(.compileted)").css({ display: "none" })
    $(".lists li.compileted").css({ display: "flex" })
    $(".lists li.delete").css({ display: "none" })
    $(".lists li .recycle-btn").css({ display: "none" })
    addActive($(this))
  })

  $('[data-filter="clear-completed"]').on("click", () =>
    a($(".lists li.compileted"))
  )

  function a(li) {
    $(li).each(function () {
      $(li).remove()
      notification($(li).find("span").text(), "silindi", "")
      calcCount($(".lists"))
      addActive($(this))
      removeTodoObject($(this).attr("key"))
    })
  }

  // Recycle bin
  function recycleFilter() {
    $(".lists li:not(.delete)").css({ display: "none" })
    $(".lists li.delete").css({ display: "flex" })
    $(".lists li .recycle-btn").css({ display: "flex" })
  }

  function hardDelete(el, val) {
    $(el).on("click", function () {
      $(this).closest("li").remove()
      hardDeleteFromLocalStorage($(this).closest("li").attr("key"))
      notification(val, `todo her yerden silindi`, "")
    })
  }

  $('[data-filter="recycle"]').on("click", function () {
    recycleFilter()
    addActive($(this))
  })

  function recycleTodo(el, val, callback) {
    $(el).on("click", function () {
      let li = el.closest("li")
      $(li).removeClass("delete")
      notification(val, `todo geri qaytarildi`, "")

      recycleFromLocalStorage(el.closest("li").attr("key"))
      calcCount($(".lists"))
      callback()
    })
  }

  // add localStorage
  let todos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : []

  function addTodoToObject(val) {
    let obj = {
      id: count + 1,
      compileted: false,
      name: val,
      delete: 0,
    }
    todos.unshift(obj)
    addTodoToLocalStorage(todos)
    count++
  }

  function addTodoToLocalStorage(object) {
    let obj = JSON.stringify(object)
    localStorage.setItem("todos", obj)
  }

  function showTodoGetLocalStorage() {
    let getData = localStorage.getItem("todos")
    let parseObj = JSON.parse(getData)
    let html = parseObj?.map((item) =>
      $(
        `<li key=${item?.id} class="list-item ${
          item?.compileted && "compileted"
        } ${item.delete == 1 && "delete"}" draggable="true">
        <div>
          <button type="button" class="check ${
            item?.compileted && "compileted-btn"
          }">
            <img src="./images/icon-check.svg" alt="">
          </button>
          <span>${item?.name}</span>
        </div>
        <div>
          <img class="remove" title="${
            item.delete == 1 ? "hard delete" : "add to recycle bin"
          }" src="./images/icon-cross.svg" alt="">
          <img class="recycle-btn" src="./images/rotate.svg" alt="">
        </div>
      </li>`
      )
    )
    $(html).each(function () {
      getEl($(this).find(".check"))
      !$(this).hasClass("delete")
        ? removeEl($(this).find(".remove"), $(this).find("span").text())
        : hardDelete($(this).find(".remove"), $(this).find("span").text())
      recycleTodo(
        $(this).find(".recycle-btn"),
        $(this).find("span").text(),
        recycleFilter
      )
      $('[data-filter="clear-completed"]').on(
        "click",
        () => $(this).hasClass(".compileted") && a($(this).find(".compileted"))
      )
    })
    $(".lists").append(html)
    calcCount($(".lists"))
  }
  showTodoGetLocalStorage()

  // Todo complited from localStorage
  function updateTodoObject(id) {
    let clonedTodos = JSON.parse(localStorage.getItem("todos"))
    let newTodo = clonedTodos?.map((todo) => {
      if (todo?.id == id) {
        return { ...todo, compileted: !todo?.compileted }
      }
      return todo
    })

    todos = todos?.map((todo) => {
      if (todo?.id == id) {
        return { ...todo, compileted: !todo?.compileted }
      }
      return todo
    })
    localStorage.setItem("todos", JSON.stringify(newTodo))
    clonedTodos = newTodo
  }

  // remove todo from localStorage
  function removeTodoObject(id) {
    let clonedTodos = JSON.parse(localStorage.getItem("todos"))
    let newTodo = clonedTodos?.map((todo) => {
      if (todo.id == id) {
        return { ...todo, delete: 1 }
      }
      return todo
    })
    todos = todos?.map((todo) => {
      if (todo.id == id) {
        return { ...todo, delete: 1 }
      }
      return todo
    })
    localStorage.setItem("todos", JSON.stringify(newTodo))
    clonedTodos = newTodo
  }

  function hardDeleteFromLocalStorage(id) {
    let clonedTodos = JSON.parse(localStorage.getItem("todos"))
    let newTodo = clonedTodos?.filter((todo) => todo.id != id)
    todos = todos?.filter((todo) => todo.id != id)
    localStorage.setItem("todos", JSON.stringify(newTodo))
    clonedTodos = newTodo
  }

  function recycleFromLocalStorage(id) {
    let clonedTodos = JSON.parse(localStorage.getItem("todos"))
    let newTodo = clonedTodos?.map((todo) => {
      if (todo.id == id) {
        return { ...todo, delete: 0 }
      }
      return todo
    })
    todos = todos?.map((todo) => {
      if (todo.id == id) {
        return { ...todo, delete: 0 }
      }
      return todo
    })
    localStorage.setItem("todos", JSON.stringify(newTodo))
    clonedTodos = newTodo
  }
})
