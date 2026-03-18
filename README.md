# PathFinder

PathFinder is a React Native (Expo) mobile application for tracking physical movement in real time, saving routes locally, and reviewing past activities on a map.

---

##  Tech Stack

- Expo (Managed Workflow)
- TypeScript
- Expo Router (file-based navigation)
- react-native-maps
- expo-location
- expo-sqlite
- Zustand (state management)
- NativeWind (Tailwind for React Native)
- MapTiler (map tiles provider)

---

##  Features

- Real-time GPS tracking
- Polyline route visualization on map
- Distance and duration tracking
- Local storage of activities using SQLite
- History screen with saved routes
- Detail screen with route replay
- Error handling for permissions and GPS failures

---

## How to run the project

### Install dependencies and Start the app

```bash
npm install
npx expo install expo-router expo-location expo-sqlite react-native-maps

### 2. Start the app

```bash
npx expo start

**AI Literacy**

I used AI (primarily ChatGPT) to accelerate development of more complex parts of the app, especially around location tracking and map integration.
AI helped me:
structure the project using Expo Router and a clean folder architecture
implement foreground location tracking with expo-location
integrate MapTiler using a custom tile URL with an API key
implement distance calculation using the Haversine formula
design a reliable tracking flow (start/stop, filtering GPS noise, updating state)
I did not blindly copy code — I reviewed, tested, and adjusted all AI-generated solutions to fit the project requirements and ensure stability.

**Clean Architecture**

The project follows a clean and modular architecture, even though AI was used during development.
app/ contains only screens and routing (Expo Router)
src/hooks/ handles tracking logic (location + timers)
src/store/ manages global state using Zustand
src/lib/ contains utilities (distance, formatting, database, map config)
src/types/ defines shared TypeScript models
This separation keeps UI, business logic, and data access clearly decoupled, making the code easier to maintain and extend.

**Edge Case Handling**

Several important edge cases are handled to make the app stable:
If the user denies location permission → a clear message is shown and tracking does not start
If GPS fails or throws an error → it is caught and displayed using a dedicated error state
If the activity is too small → it is not saved
If GPS data is noisy → points under 3 meters are filtered out
If there are no saved activities → an empty state is displayed
If MapTiler API key is missing → the app still works without crashing
This ensures the app behaves predictably even in non-ideal condition

**The "Vibe"**

The app is designed to feel simple, responsive, and intentional.
The UI is minimal and focused on the core action: tracking movement
Real-time updates (distance and duration) provide immediate feedback
The map, polyline, and stats update smoothly during tracking
Navigation between screens is straightforward and fast
Clear feedback is given for errors and edge cases
The goal was not just functionality, but a smooth and intuitive user experience.

**Biggest Challenge**

The biggest challenge during the “vibe coding” process was balancing speed with reliability.
Since I was using AI to move faster, I had to make sure I fully understood what the code was doing and didn’t just rely on generated solutions. The most difficult parts were handling location permissions correctly and dealing with noisy GPS data, because small mistakes there could easily break the tracking logic or produce incorrect results.
Another challenge was making sure the app didn’t just work in ideal conditions, but also handled edge cases properly — like when the user denies permissions or when there isn’t enough data to save an activity.
Overall, the challenge was not just building features quickly, but making them stable and predictable, which helped me better understand both the tools and the problem space.
