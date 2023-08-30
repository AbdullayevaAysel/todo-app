$(document).ready(function () {
  $("#toggle-dark").on("click", function () {
    $("body").attr("thema", (_, attr) => (attr == "dark" ? "light" : "dark"))
  })

  const calcCount = (el) => {
    $("#list-count").html(el.find(".list-item").length)
  }

  function getEl(el) {
    $(el).on("click", function () {
      if ($(this).hasClass("compileted-btn")) {
        $(this).removeClass("compileted-btn")
        $(this).closest("li").removeClass("compileted")
      } else {
        $(this).addClass("compileted-btn")
        $(this).closest("li").addClass("compileted")
      }
    })
  }

  function removeEl(el) {
    $(el).on("click", function () {
      el.closest("li").remove()
      calcCount($(".lists"))
    })
  }

  const addTodo = (val) => {
    let li = $(`
    <li class="list-item">
      <div>
        <button type="button" class="check"></button>
        <span>${val}</span>
      </div>
      <img class="remove" src="./images/icon-cross.svg" alt="">
    </li>
    `)
    $(".lists").prepend($(li))
    getEl($(li).find(".check"))
    removeEl($(li).find(".remove"))
    calcCount($(".lists"))
  }

  const callAddTodo = (input, e) => {
    e.preventDefault()
    if ($(input).val() !== "") {
      addTodo($(input).val())
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
    $(".lists li.compileted").remove()
    calcCount($(".lists"))
    addActive($(this))
  })
})
