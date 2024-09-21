import { Component, OnInit } from '@angular/core';
import L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-route-planner',
  templateUrl: './route-planner.component.html',
  styleUrls: ['./route-planner.component.css']
})
export class RoutePlannerComponent implements OnInit {
  map: L.Map | undefined;
  startLocation: string = '';
  endLocation: string = '';
  waypoint: string = '';
  waypoints: string[] = [];
  routeInstructions: string[] = [];
  instructionsVisible: boolean = false;
  routeDistance: string = '';
  InstructionText: boolean = true;
  loading: boolean = false; // Track loading state

  constructor() {}

  ngOnInit(): void {
    // Initialize the map
    this.map = L.map('map').setView([51.505, -0.09], 13);

    // Load the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  // Method to add waypoints to the list
  addWaypoint() {
    if (this.waypoint) {
      this.waypoints.push(this.waypoint);
      this.waypoint = ''; // Clear the input field after adding
    }
  }

  // Method to calculate and display the route
  async calculateRoute() {
    if (this.startLocation && this.endLocation) {
      this.loading = true; // Show spinner while fetching data
      try {
        const startCoords = await this.getLatLngFromAddress(this.startLocation);
        const endCoords = await this.getLatLngFromAddress(this.endLocation);

        const waypointCoords = await Promise.all(
          this.waypoints.map(async (wp) => this.getLatLngFromAddress(wp))
        );

        this.drawRoute(startCoords, endCoords, waypointCoords);
      } catch (error) {
        console.error('Error fetching route data:', error);
      } finally {
        this.loading = false; // Hide spinner after fetching is done
      }
    }
  }

  // Method to get LatLng from address using Nominatim
  getLatLngFromAddress(address: string): Promise<L.LatLng> {
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    return fetch(apiUrl)
      .then(response => response.json())
      .then((data: any[]) => {
        if (data.length > 0) {
          const latLng = new L.LatLng(data[0].lat, data[0].lon);
          return latLng;
        } else {
          throw new Error(`Address not found: ${address}`);
        }
      });
  }

  // Method to draw route on the map and display instructions/distance
  drawRoute(startCoords: L.LatLng, endCoords: L.LatLng, waypointCoords: L.LatLng[]) {
    if (this.map) {
      const routingControl = L.Routing.control({
        waypoints: [startCoords, ...waypointCoords, endCoords],
        routeWhileDragging: true,
        showAlternatives: true,
        fitSelectedRoutes: true,
        altLineOptions: { styles: [{ color: 'black', opacity: 0.15, weight: 9 }] },
      }).addTo(this.map);

      // Clear previous route details
      this.routeInstructions = [];
      this.routeDistance = '';

      // Listen for routesfound event to get distance and instructions
      routingControl.on('routesfound', (e: any) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const instructions = routes[0].instructions;

        // Calculate and show distance
        const distanceInKm = (summary.totalDistance / 1000).toFixed(2);
        this.routeDistance = `${distanceInKm} km`;

        // Display route instructions
        this.routeInstructions = instructions.map((instr: any) => instr.text);
      });
    }
  }

  // Toggle route instructions visibility
  toggleInstructions() {
    this.instructionsVisible = !this.instructionsVisible;
    this.InstructionText = !this.InstructionText;
  }
}
