$(document).ready(function () {
  $("#toggle-dark").on("click", function () {
    $("body").attr("thema", (_, attr) => (attr == "dark" ? "light" : "dark"))
  })

  const calcCount = (el) => {
    $("#list-count").html(el.find(".list-item").length)
  }

  function getEl(el) {
    $(el).on("click", function () {
      let li = $(this).closest("li")
      console.log(li);
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
    })
  }

  function removeEl(el, val) {
    $(el).on("click", function () {
      el.closest("li").remove()
      calcCount($(".lists"))

      notification(val, `todo silindi`, "")
    })
  }

  const addTodo = (val) => {
    let li = $(`
    <li class="list-item" draggable="true">
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
    <div class="notification-item">
      <i class="text">${value}</i> <span> ${text}</span>
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

  const callAddTodo = (input, e) => {
    e.preventDefault()
    if ($(input).val() !== "") {
      let val = $(input).val()
      addTodo(val)
      notification(val, `elave olundu`, "+")
      addTodoToObject(val)
      $(input).val("")
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

  $('[data-filter="clear-completed"]').on("click", function (e) {
    let li = $(".lists li.compileted")
    $(li).remove()
    notification($(li).find("span").text(), "compiletedler silindi", "")
    calcCount($(".lists"))
    addActive($(this))
  })

  // add localStorage

  let todos = localStorage.getItem("todos")
    ? JSON.parse(localStorage.getItem("todos"))
    : []
  let count = 0
  function addTodoToObject(val) {
    let obj = {}
    obj["id"] = count
    obj["name"] = val
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
    let html = parseObj.map(
      (item) =>
        `<li key=${item?.id} class="list-item" draggable="true">
      <div>
        <button type="button" class="check">
          <img src="./images/icon-check.svg" alt="">
        </button>
        <span>${item?.name}</span>
      </div>
      <img class="remove" src="./images/icon-cross.svg" alt="">
    </li>`
    )
    $(".lists").append(html)
  }
  showTodoGetLocalStorage()
})
