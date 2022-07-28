let floors = document.getElementById("floor");
let lifts = document.getElementById("lifts");
let button = document.querySelector(".button");
let button_disable = document.getElementById("button");
let lift_area = document.querySelector(".lift_area");

button.addEventListener("click", function () {
  if (parseInt(lifts.value) <= 3) {
    constructFloor(parseInt(floors.value), parseInt(lifts.value));
    document.getElementById("button").style.display = "none";
  } else {
    document.getElementById("button").style.display = "none";
    lift_area.innerHTML = "Number of lifts Can't exceed 3! Please try again.";
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
});

const constructFloor = (floorCount, liftCount) => {
  for (i = floorCount; i > 0; i--) {
    //floor div
    let newDiv = document.createElement("div");
    let container_floor = document.createElement("div");
    container_floor.classList.add("flooring_container");
    let flooring = document.createElement("hr");
    container_floor.appendChild(flooring);
    // button area
    let buttonDiv = document.createElement("div");
    //up button
    let upButton = document.createElement("div");
    //down buttom
    let downButton = document.createElement("div");

    // lift title
    let liftTitle = document.createElement("div");

    newDiv.classList.add(`floors`);
    newDiv.setAttribute("id", `floor_${i}`);

    buttonDiv.appendChild(upButton);
    // buttonDiv.appendChild(downButton);

    upButton.append((document.createTextNode = `UP`));
    buttonDiv.appendChild(downButton);
    downButton.append((document.createTextNode = `DOWN`));

    newDiv.appendChild(buttonDiv);
    flooring.classList.add("floor-bound");
    newDiv.appendChild(container_floor);

    buttonDiv.classList.add(`button_area`);
    upButton.classList.add(`up_button`);
    upButton.setAttribute("id", `up_button`);

    upButton.setAttribute("data-floorup", `${i}`);
    downButton.setAttribute("id", `down_button`);
    downButton.setAttribute("data-floordown", `${i}`);
    downButton.classList.add(`down_button`);
    liftTitle.classList.add(`lift_title`);
    buttonDiv.appendChild(liftTitle);

    if (i === 1) {
      liftTitle.append((document.createTextNode = `Ground Floor`));
      for (j = 0; j < liftCount; j++) {
        let lift = document.createElement("div");
        let lift_door = document.createElement("div");
        lift.appendChild(lift_door);
        lift.setAttribute("data-lift", `${j}`);
        lift.setAttribute("data-location", `${i}`);
        newDiv.appendChild(lift);
        lift.classList.add("lift");
        lift.setAttribute("id", "lift");
        lift_door.classList.add("lift_door");
      }
    } else {
      liftTitle.append((document.createTextNode = `Floor ${i}`));
      buttonDiv.appendChild(liftTitle);
    }
    lift_area.append(newDiv);
  }
};

let nearestLift = {};
document.addEventListener("click", function (event) {
  const availableLift = Array.from(document.getElementsByClassName("lift"));
  const data = Array.from(document.getElementsByClassName("floors"));
  data.forEach((item) => {
    item.childNodes.forEach((content) => {
      console.log(content[0]);
    });
  });
  if (event.target.classList.contains("up_button")) {
    const sameLift =
      parseInt(event.target.dataset.floorup) -
      parseInt(document.getElementById("lift").dataset.location);
    for (let i = 0; i < availableLift.length; i++) {
      if (
        !availableLift[i].classList.contains("in_transit") &&
        event.target.dataset.floorup &&
        document.getElementById(`floor_${event.target.dataset.floorup}`) !==
          null &&
        sameLift !== 0
      ) {
        availableLift[i].classList.add("in_transit");
        liftController(event, event.target.dataset.floorup, availableLift[i]);
        break;
      }
    }
  } else if (event.target.classList.contains("down_button")) {
    const sameLift =
      parseInt(event.target.dataset.floordown) -
      parseInt(document.getElementById("lift").dataset.location);
    for (let i = 0; i < availableLift.length; i++) {
      if (
        !availableLift[i].classList.contains("in_transit") &&
        event.target.dataset.floordown &&
        document.getElementById(`floor_${event.target.dataset.floordown}`) !==
          null &&
        sameLift !== 0 &&
        event.target.dataset.floordown !== availableLift[i].dataset.location
      ) {
        availableLift[i].classList.add("in_transit");
        liftController(event, event.target.dataset.floordown, availableLift[i]);
        break;
      }
    }
  }
});

const liftController = (event, selectedFloor, available_lift) => {
  let floor_up = document.getElementById("up_button");
  let floor_down = document.getElementById("down_button");
  let floor_oo = document.getElementsByClassName("floors").length;

  if (event.target.dataset.floorup) {
    const xy = document.getElementById(`floor_${event.target.dataset.floorup}`);
    event.target.parentNode.parentNode.classList.add("occupied");
    // To travel to the selected floor by te user
    const travelTo = parseInt(selectedFloor - 1);

    // Location of the lift
    const travel = parseInt(available_lift.dataset.location);

    const final_travel = Math.abs(parseInt(selectedFloor) - travel);
    available_lift.dataset.location = selectedFloor;

    setTimeout(() => {
      available_lift.children[0].classList.add("lift-doors");
    }, final_travel * 2000 + 1000);

    setTimeout(() => {
      available_lift.children[0].classList.remove("lift-doors");
    }, final_travel * 2000 + 3000);

    setTimeout(() => {
      available_lift.classList.remove("in_transit");
    }, final_travel * 2000 + 5000);

    // available_lift.style.transition = `transform ${travelTo * 2}s linear`;
    if (selectedFloor === "1") {
      available_lift.style.transition = `transform ${(travel - 1) * 2}s linear`;
    } else if (final_travel === 0) {
      available_lift.style.transition = `transform ${1 * 2}s linear`;
    } else {
      available_lift.style.transition = `transform ${final_travel * 2}s linear`;
    }
    available_lift.style.transform =
      "translateY(" +
      destinationCalculator(floor_oo, floor_up, selectedFloor) * travelTo * -1 +
      "px)";
  } else if (event.target.dataset.floordown) {
    const travelTo = parseInt(selectedFloor - 1);
    const travel = parseInt(available_lift.dataset.location);

    const final_travel = Math.abs(parseInt(selectedFloor) - travel);
    available_lift.dataset.location = selectedFloor;
    const xy = document.getElementById(
      `floor_${event.target.dataset.floordown}`
    );

    setTimeout(() => {
      available_lift.children[0].classList.add("lift-doors");
    }, final_travel * 2000 + 1000);

    setTimeout(() => {
      available_lift.children[0].classList.remove("lift-doors");
    }, final_travel * 2000 + 3000);

    setTimeout(() => {
      available_lift.classList.remove("in_transit");
    }, final_travel * 2000 + 5000);

    if (selectedFloor === "1") {
      available_lift.style.transition = `transform ${(travel - 1) * 2}s linear`;
    } else if (final_travel === 0) {
      available_lift.style.transition = `transform ${1 * 2}s linear`;
    } else {
      available_lift.style.transition = `transform ${final_travel * 2}s linear`;
    }
    available_lift.style.transform =
      "translateY(" +
      destinationCalculator(floor_oo, floor_down, selectedFloor) *
        travelTo *
        -1 +
      "px)";
  }
  console.log(destinationCalculator(floor_oo, floor_up, selectedFloor));
};

const destinationCalculator = (totalFloors, buttonClicked, floor) => {
  const x = parseInt(floor) - 1 - parseInt(floor) * 0.1;
  return (
    document
      .getElementsByClassName("floors")
      .item(totalFloors - buttonClicked)
      .querySelectorAll(".floor-bound")
      .item(0).offsetTop +
    parseInt(floor) -
    x
  );
  // 13 -
  // floor * 0.12
};

/**
 1. Check for whether the lift is available at the selected floor or not.
    For this first check the current location of the lift and check the selected floor, if both are same, do not send in a new lift.
  
 */

// data.forEach((item) => {
//   item.childNodes.forEach((content) => {
//     if (content.classList.contains("lift")) {
//       console.log(content);
//       // item.setAttribute("data-floor", `${event.target.dataset.floorup}`);
//       // item.setAttribute("id", `floor_${event.target.dataset.floorup}`);
//       // console.log(item);
//       // console.log(event.target.classList.contains("true"));
//     }
//     // else {
//     //   // event.target.classList.add("false");
//     //   // console.log(event.target.classList.contains("false"));
//     //   item.removeAttribute("id");
//     // }
//   });
// });
