const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");
const {users, events, participants, locations} = require("./fakedata");

const typeDefs = `#graphql
    type User {
        id: Int
        username: String!
        email: String!
        events: [Event!]!
    }

    type Event {
        id: Int!
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: Int!
        location: Location!
        user_id: Int!
        user: User!
        participants: [Participant!]!
    }

    type Location {
        id: Int!
        name: String!
        desc: String!
        lat: Float!
        lng: Float!
    }

    type Participant {
        id: Int!
        user_id: Int!
        event_id: Int!
    }

    type Query {
        users: [User!]!
        user(id: Int!): User!
        events: [Event!]!
        event(id: Int!): Event!
        locations: [Location!]!
        location(id: Int!): Location!
        participants: [Participant!]!
        participant(id: Int!): Participant!
    }
`;

const resolvers = {
    Query: {
      // users 
      users: () => users,
      user: (parent, args) => users.find(u => u.id === args.id),
      // events
      events: () => events,
      event: (parent, args) => events.find(e => e.id === args.id),
      // locations
      locations: () => locations,
      location: (parent, args) => locations.find(l => l.id === args.id),
      // participants
      participants: () => participants,
      participant: (parent, args) => participants.find(p => p.id === args.id)
    },

    // user alanı altından events e ulaşmak için resolver
    User: {
        events: (parent, args) => events.filter(e => e.user_id === parent.id)
    },
    // event alanı altından user a, location a ve participants a ulaşmak için resolver
    Event: {
        user: (parent, args) => users.find(u => u.id === parent.user_id),
        location: (parent, args) => locations.find(l => l.id === parent.location_id),
        participants: (parent, args) => participants.filter(p => p.event_id === parent.id)
    }
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins : [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
  });
  
  const startServer = async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
      });    
      console.log(`🚀  Server ready at: ${url}`);
  }

  startServer();
  
