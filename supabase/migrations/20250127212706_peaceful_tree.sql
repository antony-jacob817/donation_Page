/*
  # Initial Schema Setup for Donation Platform

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - user_type (text) - either 'donor' or 'organization'
      - created_at (timestamp)
    
    - donor_profiles
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - full_name (text)
      - phone_number (text)
      - address (text)
      - donation_preferences (text[])
      - created_at (timestamp)
    
    - organization_profiles
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - organization_name (text)
      - registration_number (text)
      - address (text)
      - head_name (text)
      - verification_status (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('donor', 'organization')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Donor profiles
CREATE TABLE donor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone_number text,
  address text,
  donation_preferences text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donors can read own profile"
  ON donor_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Donors can update own profile"
  ON donor_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Organization profiles
CREATE TABLE organization_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  organization_name text NOT NULL,
  registration_number text NOT NULL,
  address text NOT NULL,
  head_name text NOT NULL,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizations can read own profile"
  ON organization_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Organizations can update own profile"
  ON organization_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);