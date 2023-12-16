CREATE VIEW single_astronaut_view AS
SELECT astronauts.*, missions.mission_id, missions.mission_name, missions.mission_insignia, missions.space_agency, missions.launch_location
FROM astronauts
LEFT JOIN astronaut_missions 
ON astronauts.astronaut_id = astronaut_missions.astronaut_id
LEFT JOIN missions 
ON astronaut_missions.mission_id = missions.mission_id;

CREATE VIEW single_mission_view AS
SELECT missions.*, astronauts.astronaut_id, astronauts.astronaut_name, astronauts.astronaut_photo, astronauts.country, astronauts.hours_in_space
FROM missions
LEFT JOIN astronaut_missions 
ON missions.mission_id = astronaut_missions.mission_id
LEFT JOIN astronauts 
ON astronaut_missions.astronaut_id = astronauts.astronaut_id;
