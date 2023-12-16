USE astroCollective;

#YYYY-MM-DD

INSERT INTO astronauts (astronaut_name, astronaut_photo, date_of_birth, date_of_death, country, hours_in_space, astronaut_profile)
VALUES ('John Glenn', 'https://www.nmspacemuseum.org/wp-content/uploads/2019/03/john-glenn-scaled.jpg', '1921-07-18', '2016-12-08', 'United States', 240.8, 'John Herschel Glenn Jr. was an American Marine Corps aviator, engineer, astronaut, businessman, and politician. He was the third American in space, and the first American to orbit the Earth, circling it three times in 1962.[7] Following his retirement from NASA, he served from 1974 to 1999 as a U.S. Senator from Ohio; in 1998, he flew into space again at the age of 77.'),
       ('Sally Ride', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Sally_Ride_%281984%29.jpg/1200px-Sally_Ride_%281984%29.jpg', '1951-05-26', '2012-07-23', 'United States', 343.8, 'Sally Kristen Ride was an American astronaut and physicist. Born in Los Angeles, she joined NASA in 1978, and in 1983 became the first American woman and the third woman to fly in space, after cosmonauts Valentina Tereshkova in 1963 and Svetlana Savitskaya in 1982. She was the youngest American astronaut to have flown in space, having done so at the age of 32.'),
       ('Ronald McNair', 'https://www.csus.edu/academic-affairs/mcnair-scholars-program/_internal/_images/ronald_mcnair.jpg', '1950-10-21', '1986-01-28', 'United States', 191.3, 'Ronald Erwin McNair was an American NASA astronaut and physicist. He died at the age of 35 during the launch of the Space Shuttle Challenger on mission STS-51-L, in which he was serving as one of three mission specialists in a crew of seven.'),
       ('Jack Swigert', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Jack_Swigert.jpg/440px-Jack_Swigert.jpg', '1931-08-30', '1982-12-27', 'United States', 142.9, 'John Leonard Swigert Jr. was an American NASA astronaut, test pilot, mechanical engineer, aerospace engineer, United States Air Force pilot, and politician. In April 1970, as command module pilot of Apollo 13, he became one of 24 astronauts who flew to the Moon.[1][2] Ironically, due to the "slingshot" route around the Moon they chose to safely return to Earth, the Apollo 13 astronauts flew further away from Earth than any other astronauts before or since, though they had to abort the Moon landing.'),
       ('Dick Scobee', 'https://upload.wikimedia.org/wikipedia/commons/4/42/Scobee-fr.jpg', '1939-05-19', '1986-01-28', 'United States', 167.7, 'Francis Richard Scobee was an American pilot, engineer, and astronaut. He was killed while he was commanding the Space Shuttle Challenger in 1986, which suffered catastrophic booster failure during launch of the STS-51-L mission.'),
       ('Gordon Cooper', 'https://www.nasa.gov/wp-content/uploads/2023/05/l-gordon-cooper-jwfull.jpg', '1927-03-06', '2004-10-04', 'United States', 225.2, 'Leroy Gordon "Gordo" Cooper Jr. was an American aerospace engineer, test pilot, United States Air Force pilot, and the youngest of the seven original astronauts in Project Mercury, the first human space program of the United States. Cooper learned to fly as a child, and after service in the United States Marine Corps during World War II, he was commissioned into the United States Air Force in 1949. After service as a fighter pilot, he qualified as a test pilot in 1956, and was selected as an astronaut in 1959.');

INSERT INTO astronauts (astronaut_name, astronaut_photo, date_of_birth, country, hours_in_space, astronaut_profile)
VALUES ('Jim Lovell', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/James_Lovell.jpg/440px-James_Lovell.jpg', '1928-03-25', 'United States', 715.1, 'James Arthur Lovell Jr. is an American retired astronaut, naval aviator, test pilot and mechanical engineer. In 1968, as command module pilot of Apollo 8, he became, with Frank Borman and William Anders, one of the first three astronauts to fly to and orbit the Moon. He then commanded the Apollo 13 lunar mission in 1970 which, after a critical failure en route, circled the Moon and returned safely to Earth.'),
       ('Fred Haise', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Fred_Haise.jpg/440px-Fred_Haise.jpg', '1933-11-14', 'United States', 142.9, 'Fred Wallace Haise Jr. is an American former NASA astronaut, engineer, fighter pilot with the U.S. Marine Corps and U.S. Air Force, and a test pilot. He is one of 24 people to have flown to the Moon, having flown as Lunar Module pilot on Apollo 13. He was slated to become the 6th person to walk on the Moon, but the Apollo 13 landing mission was aborted en route.'),
       ('Timothy Kopra', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/TimotyKorpav2.jpg/440px-TimotyKorpav2.jpg', '1963-04-09', 'United States', 5858, 'Timothy Lennart "Tim" Kopra is an engineer, a Colonel in the United States Army and a retired NASA astronaut. He served aboard the International Space Station as a flight engineer for Expedition 20, returning to Earth aboard Space Shuttle Discovery on the STS-128 mission on September 11, 2009. He returned to the ISS for the second time in December 2015, as part of Expedition 46 and as the commander of 47.'),
       ('Nicole Stott', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Nicole_Stott_v2.jpg/440px-Nicole_Stott_v2.jpg', '1962-11-19', 'United States', 2477, 'Nicole Marie Passonno Stott (born November 19, 1962) is an American engineer and a retired NASA astronaut. She served as a flight engineer on ISS Expedition 20 and Expedition 21 and was a mission specialist on STS-128 and STS-133. After 27 years of working at NASA, the space agency announced her retirement effective June 1, 2015. She is married to Christopher Stott, a Manx-born American space entrepreneur.'),
       ('Frederick W. Sturckow', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Rick_Sturckow.jpg/440px-Rick_Sturckow.jpg', '1961-08-11', 'United States', 1234, 'Sturckow was born La Mesa, California, but considers Lakeside, California, to be his hometown. He is married to the former Michele A. Street of Great Mills, Maryland. He enjoys flying and physical training. His father, Karl H. Sturckow, resides in Whittier, CA and his mother, Janette R. Sturckow, resides in La Mesa. He was a member of the Marine Corps Association (MCA) and a former member of Society of Experimental Test Pilots (SETP).'),
       ('David Scott', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Dave_Scott_Apollo_15_CDR.jpg/440px-Dave_Scott_Apollo_15_CDR.jpg', '1932-06-06', 'United States', 547, 'David Randolph Scott is an American retired test pilot and NASA astronaut who was the seventh person to walk on the Moon. Selected as part of the third group of astronauts in 1963, Scott flew to space three times and commanded Apollo 15, the fourth lunar landing; he is one of four surviving Moon walkers and the only living commander of a spacecraft that landed on the Moon.');

INSERT INTO missions (mission_name, launch_date, return_date, launch_location, space_agency, spacecraft, crew_size, mission_insignia, mission_details)
VALUES ('STS-128', '2009-08-29', '2009-09-12', 'Kennedy Space Center, LC-39A', 'NASA', 'Space Shuttle Disovery', 7, 'https://upload.wikimedia.org/wikipedia/commons/9/91/STS-128_insignia.jpg', 'STS-128 was a NASA Space Shuttle mission to the International Space Station that launched on August 28, 2009. Space Shuttle Discovery carried the Multi-Purpose Logistics Module Leonardo as its primary payload. Leonardo contained a collection of experiments for studying the physics and chemistry of microgravity.'),
       ('Apollo 13', '1970-04-11', '1970-04-17', 'Kennedy Space Center, LC-39A', 'NASA', 'Saturn V', 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Apollo_13-insignia.png/1022px-Apollo_13-insignia.png', 'Apollo 13 was the seventh crewed mission in the Apollo space program and the third meant to land on the Moon. The craft was launched from Kennedy Space Center on April 11, 1970, but the lunar landing was aborted after an oxygen tank in the service module (SM) ruptured two days into the mission, disabling its electrical and life-support system.'),
       ('Gemini 8', '1966-03-16', '1966-03-17', 'Cape Kennedy LC-19', 'NASA', 'Titan II GLV', 2, 'https://www.thespacecollective.com/media/catalog/product/cache/64b2ce5e9db1d173cc7981641bc9f2ca/image/232132c/gemini-8-patch.jpg', 'Gemini 8 was the sixth crewed spaceflight in the Gemini program. It was launched on March 16, 1966, and was the 14th crewed American flight and the 22nd crewed spaceflight overall. The mission conducted the first docking of two spacecraft in orbit, but also suffered the first critical in-space system failure of a U.S. spacecraft which threatened the lives of the astronauts and required an immediate abort of the mission. The crew returned to Earth safely.'),
       ('Apollo 8', '1968-12-21', '1968-12-27', 'Kennedy Space Center, LC-39A', 'NASA', 'Saturn V', 3, 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Apollo-8-patch.jpg', 'Apollo 8 was the first crewed spacecraft to leave low Earth orbit and the first human spaceflight to reach the Moon. The crew orbited the Moon ten times without landing, and then departed safely back to Earth.'),
       ('STS-37', '1991-04-05', '1991-04-11', 'Kennedy Space Center, LC-39B', 'NASA', 'Space Shuttle Atlantis', 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Sts-37-patch.png/2043px-Sts-37-patch.png', 'STS-37, the thirty-ninth NASA Space Shuttle mission and the eighth flight of the Space Shuttle Atlantis, was a six-day mission with the primary objective of launching the Compton Gamma Ray Observatory (CGRO), the second of the Great Observatories program which included the visible-spectrum Hubble Space Telescope (HST), the Chandra X-ray Observatory (CXO) and the infrared Spitzer Space Telescope.'),
       ('STS-88', '1998-12-04', '1998-12-16', 'Kennedy Space Center, LC-39B', 'NASA', 'Space Shuttle Endeavour', 6, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Sts-88-patch.svg/2048px-Sts-88-patch.svg.png', 'STS-88 was the first Space Shuttle mission to the International Space Station (ISS). It was flown by Space Shuttle Endeavour, and took the first American module, the Unity node, to the station. The seven-day mission was highlighted by the mating of the U.S.-built Unity node to the Functional Cargo Block (Zarya module) already in orbit, and three spacewalks to connect power and data transmission cables between the Node and the FGB. Zarya, built by Boeing and the Russian Space Agency, was launched on a Russian Proton rocket from the Baikonur Cosmodrome in Kazakhstan in November 1998.');

INSERT INTO spacecraft (craft_name, craft_status, craft_launches, craft_photo, craft_details)
VALUES ('Saturn V', 'Retired', 12, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Apollo_11_Launch_-_GPN-2000-000630.jpg/440px-Apollo_11_Launch_-_GPN-2000-000630.jpg', 'Saturn V is a retired American super heavy-lift launch vehicle developed by NASA under the Apollo program for human exploration of the Moon. The rocket was human-rated, had three stages, and was powered with liquid fuel. Flown from 1967 to 1973, it was used for nine crewed flights to the Moon, and to launch Skylab, the first American space station.'),
       ('Space Shuttle Challenger', 'Destroyed', 10, 'https://www.history.navy.mil/content/history/museums/nmusn/explore/photography/humanitarian/20th-century/1980-1989/1986-space-shuttle-challenger/_jcr_content/body/media_asset_248703872/image.img.jpg/1677782108795.jpg', 'Space Shuttle Challenger (OV-099) was a Space Shuttle orbiter manufactured by Rockwell International and operated by NASA. Named after the commanding ship of a nineteenth-century scientific expedition that traveled the world, Challenger was the second Space Shuttle orbiter to fly into space after Columbia, and launched on its maiden flight in April 1983. It was destroyed in January 1986 soon after launch in an accident that killed all seven crewmembers aboard.'),
       ('Space Launch System', 'Active', 1, 'https://aviationweek.com/sites/default/files/styles/crop_freeform/public/2022-08/slsprelaunch.jpg?itok=ToV9f2Lr', 'The Space Launch System (SLS) is an American super heavy-lift expendable launch vehicle used by NASA. As the primary launch vehicle of the Artemis Moon landing program, SLS is designed to launch the crewed Orion spacecraft on a trans-lunar trajectory. The first SLS launch was the uncrewed Artemis 1, which took place on 16 November 2022.'),
       ('Space Shuttle Endeavour', 'Retired', 25, 'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2010/02/space_shuttle_endeavour_on_the_launch_pad/9274093-5-eng-GB/Space_Shuttle_Endeavour_on_the_launch_pad_pillars.jpg', 'Space Shuttle Endeavour (Orbiter Vehicle Designation: OV-105) is a retired orbiter from the Space Shuttle program and the fifth and final operational Shuttle built. It embarked on its first mission, STS-49, in May 1992 and its 25th and final mission, STS-134, in May 2011. STS-134 was expected to be the final mission of the Space Shuttle program, but with the authorization of STS-135 by the United States Congress, Atlantis became the last shuttle to fly.'),
       ('Mercury-Redstone Launch Vehicle', 'Retired', 6, 'https://upload.wikimedia.org/wikipedia/commons/8/88/Ham_Launch_-_GPN-2000-001007.jpg', 'The Mercury-Redstone Launch Vehicle, designed for Project Mercury, was the first American crewed space booster. It was used for six sub-orbital Mercury flights from 1960-1961; culminating with the launch of the first, and 11 weeks later, the second American (and the second and third humans) in space. The four subsequent Mercury human spaceflights used the more powerful Atlas booster to enter low Earth orbit.'),
       ('Space Shuttle Discovery', 'Retired', 39, 'https://i.natgeofe.com/n/6b358bc2-59dc-4fb5-aa3f-6526d5b2b135/33018.jpg', 'Space Shuttle Discovery (Orbiter Vehicle Designation: OV-103) is a retired American spacecraft. The spaceplane was one of the orbiters from the Space Shuttle program and the third of five fully operational orbiters to be built. Its first mission, STS-41-D, flew from August 30 to September 5, 1984. Over 27 years of service it launched and landed 39 times, aggregating more spaceflights than any other spacecraft to date. The Space Shuttle launch vehicle had three main components: the Space Shuttle orbiter, a single-use central fuel tank, and two reusable solid rocket boosters. Nearly 25,000 heat-resistant tiles cover the orbiter to protect it from high temperatures on re-entry.');

INSERT INTO astronaut_missions (astronaut_id, mission_id) VALUES
  (4, 2), 
  (7, 2), 
  (8, 2),
  (10, 1),
  (11, 1);