import Alarm from './App';
import Timer from './Timer';

function Navbar() {
  return (
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand p-2" href="#">VrClock</a>
        <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav mr-auto">

            <li class="nav-item">
                <a class="nav-link" href="#">Clock</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Timer</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://github.com/VictorKwong">GitHub</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://victorkaiwong.com">Portfolio</a>
            </li>
            </ul>
        </div>
        </nav>
    </div>
  );
}

export default Navbar;