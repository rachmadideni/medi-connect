-- =============================================================================
-- Medi Connect — Seed Data
-- Run in AlloyDB Studio after running schema.sql
--
-- Prerequisites:
--   1. google_ml_integration + vector extensions enabled
--   2. Vertex AI User IAM role granted to the AlloyDB service account
--   3. GRANT EXECUTE ON FUNCTION embedding TO postgres;
--   4. Replace <BUCKET> with your GCS bucket name before running
-- =============================================================================

-- -----------------------------------------------------------------------------
-- DOCTORS
-- The embedding() function calls Vertex AI text-embedding-005 inside AlloyDB.
-- No application-side embedding code is required.
-- -----------------------------------------------------------------------------

-- 1. Dr. Sarah Mitchell — Cardiologist
INSERT INTO doctors (
  name, specialty, location, rating, reviews, available,
  experience, avatar, image_url, bio, languages, education,
  search_embedding
) VALUES (
  'Dr. Sarah Mitchell',
  'Cardiologist',
  'New York, NY',
  4.9, 214, 'Today', 14, 'SM',
  'https://storage.googleapis.com/medi-connect-images/dr-sarah-mitchell.png',
  'Dr. Mitchell is a board-certified cardiologist with over 14 years of experience in diagnosing and treating complex heart conditions. She specializes in preventive cardiology and minimally invasive procedures.',
  ARRAY['English', 'Spanish'],
  'Harvard Medical School',
  embedding('text-embedding-005',
    'Dr. Sarah Mitchell. Cardiologist at New York, NY. ' ||
    'Dr. Mitchell is a board-certified cardiologist with over 14 years of experience in diagnosing and treating complex heart conditions. She specializes in preventive cardiology and minimally invasive procedures. ' ||
    'Languages: English, Spanish'
  )::vector
);

-- 2. Dr. Omar Al-Rashid — General Practice
INSERT INTO doctors (
  name, specialty, location, rating, reviews, available,
  experience, avatar, image_url, bio, languages, education,
  search_embedding
) VALUES (
  'Dr. Omar Al-Rashid',
  'General Practice',
  'Los Angeles, CA',
  4.7, 189, 'Tomorrow', 8, 'OA',
  'https://storage.googleapis.com/medi-connect-images/dr-omar-al-rashid.png',
  'Dr. Al-Rashid is a compassionate family doctor who provides comprehensive primary care for patients of all ages. He emphasizes preventive medicine and long-term patient relationships.',
  ARRAY['English', 'Arabic'],
  'UCLA School of Medicine',
  embedding('text-embedding-005',
    'Dr. Omar Al-Rashid. General Practice at Los Angeles, CA. ' ||
    'Dr. Al-Rashid is a compassionate family doctor who provides comprehensive primary care for patients of all ages. He emphasizes preventive medicine and long-term patient relationships. ' ||
    'Languages: English, Arabic'
  )::vector
);

-- 3. Dr. Amara Osei — Dermatologist
INSERT INTO doctors (
  name, specialty, location, rating, reviews, available,
  experience, avatar, image_url, bio, languages, education,
  search_embedding
) VALUES (
  'Dr. Amara Osei',
  'Dermatologist',
  'Chicago, IL',
  4.8, 302, 'Today', 11, 'AO',
  'https://storage.googleapis.com/medi-connect-images/dr-amara-osei.png',
  'Dr. Osei is a leading dermatologist specializing in both medical and cosmetic skin conditions. She is known for her expertise in treating skin cancer, eczema, and acne.',
  ARRAY['English', 'French', 'Twi'],
  'Johns Hopkins School of Medicine',
  embedding('text-embedding-005',
    'Dr. Amara Osei. Dermatologist at Chicago, IL. ' ||
    'Dr. Osei is a leading dermatologist specializing in both medical and cosmetic skin conditions. She is known for her expertise in treating skin cancer, eczema, and acne. ' ||
    'Languages: English, French, Twi'
  )::vector
);

-- 4. Dr. Brandon Hayes — Pediatrician
INSERT INTO doctors (
  name, specialty, location, rating, reviews, available,
  experience, avatar, image_url, bio, languages, education,
  search_embedding
) VALUES (
  'Dr. Brandon Hayes',
  'Pediatrician',
  'Houston, TX',
  4.6, 97, 'Wed', 6, 'BH',
  'https://storage.googleapis.com/medi-connect-images/dr-brandon-hayes.png',
  'Dr. Hayes is a dedicated pediatrician committed to the health and well-being of children from newborns to adolescents. He has a warm, child-friendly approach that puts young patients at ease.',
  ARRAY['English'],
  'Baylor College of Medicine',
  embedding('text-embedding-005',
    'Dr. Brandon Hayes. Pediatrician at Houston, TX. ' ||
    'Dr. Hayes is a dedicated pediatrician committed to the health and well-being of children from newborns to adolescents. He has a warm, child-friendly approach that puts young patients at ease. ' ||
    'Languages: English'
  )::vector
);

-- 5. Dr. Carlos Reyes — Neurologist
INSERT INTO doctors (
  name, specialty, location, rating, reviews, available,
  experience, avatar, image_url, bio, languages, education,
  search_embedding
) VALUES (
  'Dr. Carlos Reyes',
  'Neurologist',
  'Phoenix, AZ',
  4.9, 176, 'Today', 17, 'CR',
  'https://storage.googleapis.com/medi-connect-images/dr-carlos-reyes.png',
  'Dr. Reyes is a highly regarded neurologist with expertise in stroke, epilepsy, and neurodegenerative diseases. He has published over 40 peer-reviewed papers in leading neurology journals.',
  ARRAY['English', 'Spanish', 'Portuguese'],
  'Mayo Clinic School of Medicine',
  embedding('text-embedding-005',
    'Dr. Carlos Reyes. Neurologist at Phoenix, AZ. ' ||
    'Dr. Reyes is a highly regarded neurologist with expertise in stroke, epilepsy, and neurodegenerative diseases. He has published over 40 peer-reviewed papers in leading neurology journals. ' ||
    'Languages: English, Spanish, Portuguese'
  )::vector
);

-- 6. Dr. Arjun Patel — Psychiatrist
INSERT INTO doctors (
  name, specialty, location, rating, reviews, available,
  experience, avatar, image_url, bio, languages, education,
  search_embedding
) VALUES (
  'Dr. Arjun Patel',
  'Psychiatrist',
  'Philadelphia, PA',
  4.7, 143, 'Tomorrow', 9, 'AP',
  'https://storage.googleapis.com/medi-connect-images/dr-arjun-patel.png',
  'Dr. Patel is a compassionate psychiatrist specializing in anxiety, depression, and trauma-related disorders. He integrates evidence-based therapies with a holistic approach to mental wellness.',
  ARRAY['English', 'Hindi', 'Gujarati'],
  'University of Pennsylvania School of Medicine',
  embedding('text-embedding-005',
    'Dr. Arjun Patel. Psychiatrist at Philadelphia, PA. ' ||
    'Dr. Patel is a compassionate psychiatrist specializing in anxiety, depression, and trauma-related disorders. He integrates evidence-based therapies with a holistic approach to mental wellness. ' ||
    'Languages: English, Hindi, Gujarati'
  )::vector
);

-- 7. Dr. Ashley Carter — Orthopedic
INSERT INTO doctors (
  name, specialty, location, rating, reviews, available,
  experience, avatar, image_url, bio, languages, education,
  search_embedding
) VALUES (
  'Dr. Ashley Carter',
  'Orthopedic',
  'San Antonio, TX',
  4.5, 88, 'Thu', 12, 'AC',
  'https://storage.googleapis.com/medi-connect-images/dr-ashley-carter.png',
  'Dr. Carter specializes in sports medicine and orthopedic surgery, helping athletes and active individuals recover from injuries and return to peak performance.',
  ARRAY['English'],
  'UT Health San Antonio',
  embedding('text-embedding-005',
    'Dr. Ashley Carter. Orthopedic at San Antonio, TX. ' ||
    'Dr. Carter specializes in sports medicine and orthopedic surgery, helping athletes and active individuals recover from injuries and return to peak performance. ' ||
    'Languages: English'
  )::vector
);

-- 8. Dr. Marcus Webb — Ophthalmologist
INSERT INTO doctors (
  name, specialty, location, rating, reviews, available,
  experience, avatar, image_url, bio, languages, education,
  search_embedding
) VALUES (
  'Dr. Marcus Webb',
  'Ophthalmologist',
  'San Diego, CA',
  4.8, 261, 'Today', 15, 'MW',
  'https://storage.googleapis.com/medi-connect-images/dr-marcus-webb.png',
  'Dr. Webb is a fellowship-trained ophthalmologist with expertise in cataract surgery, glaucoma management, and retinal diseases. He is known for his precision and patient-centered care.',
  ARRAY['English'],
  'UC San Diego School of Medicine',
  embedding('text-embedding-005',
    'Dr. Marcus Webb. Ophthalmologist at San Diego, CA. ' ||
    'Dr. Webb is a fellowship-trained ophthalmologist with expertise in cataract surgery, glaucoma management, and retinal diseases. He is known for his precision and patient-centered care. ' ||
    'Languages: English'
  )::vector
);

-- 9. Dr. Henry Blackwood — General Practice
INSERT INTO doctors (
  name, specialty, location, rating, reviews, available,
  experience, avatar, image_url, bio, languages, education,
  search_embedding
) VALUES (
  'Dr. Henry Blackwood',
  'General Practice',
  'Dallas, TX',
  4.6, 120, 'Tomorrow', 5, 'HB',
  'https://storage.googleapis.com/medi-connect-images/dr-henry-blackwood.png',
  'Dr. Blackwood is an energetic and approachable GP focused on preventive care and community health. He is passionate about closing health equity gaps and serving diverse patient populations.',
  ARRAY['English'],
  'UT Southwestern Medical Center',
  embedding('text-embedding-005',
    'Dr. Henry Blackwood. General Practice at Dallas, TX. ' ||
    'Dr. Blackwood is an energetic and approachable GP focused on preventive care and community health. He is passionate about closing health equity gaps and serving diverse patient populations. ' ||
    'Languages: English'
  )::vector
);

-- 10. Dr. Dariush Tehrani — Cardiologist
INSERT INTO doctors (
  name, specialty, location, rating, reviews, available,
  experience, avatar, image_url, bio, languages, education,
  search_embedding
) VALUES (
  'Dr. Dariush Tehrani',
  'Cardiologist',
  'San Jose, CA',
  4.9, 198, 'Today', 20, 'DT',
  'https://storage.googleapis.com/medi-connect-images/dr-dariush-tehrani.png',
  'Dr. Tehrani is a seasoned cardiologist with two decades of experience in interventional cardiology. He has performed over 2,000 cardiac catheterizations and is a pioneer in preventive heart health.',
  ARRAY['English', 'Persian'],
  'Stanford University School of Medicine',
  embedding('text-embedding-005',
    'Dr. Dariush Tehrani. Cardiologist at San Jose, CA. ' ||
    'Dr. Tehrani is a seasoned cardiologist with two decades of experience in interventional cardiology. He has performed over 2,000 cardiac catheterizations and is a pioneer in preventive heart health. ' ||
    'Languages: English, Persian'
  )::vector
);

-- -----------------------------------------------------------------------------
-- DOCTOR SLOTS
-- Insert availability slots for each doctor by referencing their name.
-- -----------------------------------------------------------------------------

-- 1. Dr. Sarah Mitchell
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '9:00 AM'  FROM doctors WHERE name = 'Dr. Sarah Mitchell';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '10:30 AM' FROM doctors WHERE name = 'Dr. Sarah Mitchell';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '1:00 PM'  FROM doctors WHERE name = 'Dr. Sarah Mitchell';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '3:30 PM'  FROM doctors WHERE name = 'Dr. Sarah Mitchell';

-- 2. Dr. Omar Al-Rashid
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '8:00 AM'  FROM doctors WHERE name = 'Dr. Omar Al-Rashid';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '11:00 AM' FROM doctors WHERE name = 'Dr. Omar Al-Rashid';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '2:00 PM'  FROM doctors WHERE name = 'Dr. Omar Al-Rashid';

-- 3. Dr. Amara Osei
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '9:30 AM'  FROM doctors WHERE name = 'Dr. Amara Osei';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '12:00 PM' FROM doctors WHERE name = 'Dr. Amara Osei';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '2:30 PM'  FROM doctors WHERE name = 'Dr. Amara Osei';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '4:00 PM'  FROM doctors WHERE name = 'Dr. Amara Osei';

-- 4. Dr. Brandon Hayes
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '8:30 AM'  FROM doctors WHERE name = 'Dr. Brandon Hayes';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '10:00 AM' FROM doctors WHERE name = 'Dr. Brandon Hayes';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '1:30 PM'  FROM doctors WHERE name = 'Dr. Brandon Hayes';

-- 5. Dr. Carlos Reyes
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '10:00 AM' FROM doctors WHERE name = 'Dr. Carlos Reyes';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '12:30 PM' FROM doctors WHERE name = 'Dr. Carlos Reyes';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '3:00 PM'  FROM doctors WHERE name = 'Dr. Carlos Reyes';

-- 6. Dr. Arjun Patel
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '9:00 AM'  FROM doctors WHERE name = 'Dr. Arjun Patel';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '11:00 AM' FROM doctors WHERE name = 'Dr. Arjun Patel';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '2:00 PM'  FROM doctors WHERE name = 'Dr. Arjun Patel';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '4:30 PM'  FROM doctors WHERE name = 'Dr. Arjun Patel';

-- 7. Dr. Ashley Carter
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '8:00 AM'  FROM doctors WHERE name = 'Dr. Ashley Carter';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '10:30 AM' FROM doctors WHERE name = 'Dr. Ashley Carter';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '1:00 PM'  FROM doctors WHERE name = 'Dr. Ashley Carter';

-- 8. Dr. Marcus Webb
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '9:00 AM'  FROM doctors WHERE name = 'Dr. Marcus Webb';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '11:30 AM' FROM doctors WHERE name = 'Dr. Marcus Webb';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '2:00 PM'  FROM doctors WHERE name = 'Dr. Marcus Webb';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '3:30 PM'  FROM doctors WHERE name = 'Dr. Marcus Webb';

-- 9. Dr. Henry Blackwood
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '8:30 AM'  FROM doctors WHERE name = 'Dr. Henry Blackwood';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '10:00 AM' FROM doctors WHERE name = 'Dr. Henry Blackwood';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '12:00 PM' FROM doctors WHERE name = 'Dr. Henry Blackwood';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '3:00 PM'  FROM doctors WHERE name = 'Dr. Henry Blackwood';

-- 10. Dr. Dariush Tehrani
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '9:30 AM'  FROM doctors WHERE name = 'Dr. Dariush Tehrani';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '11:00 AM' FROM doctors WHERE name = 'Dr. Dariush Tehrani';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '1:30 PM'  FROM doctors WHERE name = 'Dr. Dariush Tehrani';
INSERT INTO doctor_slots (doctor_id, slot_time) SELECT id, '4:00 PM'  FROM doctors WHERE name = 'Dr. Dariush Tehrani';
