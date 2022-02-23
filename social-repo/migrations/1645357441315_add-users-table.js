/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    create table users (
      id serial primary key,
      created_at timestamp with time zone default current_timestamp,
      updated_at timestamp with time zone default current_timestamp,
      bio varchar(400),
      username varchar(30) not null
      );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    drop table users;
  `)
};
