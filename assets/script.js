$(document).ready(function () {
  $("body").attr("thema", localStorage.getItem("thema"))

  $("#toggle-dark").on("click", function () {
    $("body").attr("thema", (_, attr) => (attr == "dark" ? "light" : "dark"))
    localStorage.setItem("thema", $("body").attr("thema"))
  })

  const calcCount = (el) => {
    $("#list-count").html(el.find(".list-item").length)
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
      el.closest("li").remove()
      calcCount($(".lists"))

      notification(val, `todo silindi`, "")
      removeTodoObject(el.closest("li").attr("key"))
    })
  }

  let parseData = localStorage.getItem("todos");
  let count =
    parseData !== null && Array.isArray(JSON.parse(parseData) && JSON.parse(parseData).length > 0)
      ? Math.max(
          ...$.map(JSON.parse(parseData), (item) => item.id)
        )
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
      <img class="remove" src="./images/icon-cross.svg" alt="">
    </li>
    `)
    $(".lists").prepend($(li))
    getEl($(li).find(".check"))
    removeEl($(li).find(".remove"), val)
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
    if ($(input).val() !== "") {
      let val = $(input).val()
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
    $(".lists li").css({ display: "flex" })
    addActive($(this))
  })

  $('[data-filter="active"]').on("click", function (e) {
    $(".lists li.compileted").css({ display: "none" })
    $(".lists li:not(.compileted)").css({ display: "flex" })
    addActive($(this))
  })

  $('[data-filter="completed"]').on("click", function (e) {
    $(".lists li:not(.compileted)").css({ display: "none" })
    $(".lists li.compileted").css({ display: "flex" })
    addActive($(this))
  })

  $('[data-filter="clear-completed"]').on("click", () =>
    a($(".lists li.compileted"))
  )

  function a(li) {
    $(li).each(function () {
      $(li).remove()
      notification($(li).find("span").text(), "compiletedler silindi", "")
      calcCount($(".lists"))
      addActive($(this))
      removeTodoObject($(this).attr("key"))
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
        `<li key=${item?.id} class="list-item iii ${
          item?.compileted && "compileted"
        }" draggable="true">
        <div>
          <button type="button" class="check ${
            item?.compileted && "compileted-btn"
          }">
            <img src="./images/icon-check.svg" alt="">
          </button>
          <span>${item?.name}</span>
        </div>
        <img class="remove" src="./images/icon-cross.svg" alt="">
      </li>`
      )
    )
    $(html).each(function () {
      getEl($(this).find(".check"))
      removeEl($(this).find(".remove"), $(this).find("span").val())
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
    let newTodo = clonedTodos?.filter((todo) => todo.id != id)
    todos = todos?.filter((todo) => todo.id != id)
    localStorage.setItem("todos", JSON.stringify(newTodo))
    clonedTodos = newTodo
  }
})
