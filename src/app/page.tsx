'use client';

import { useState, useEffect } from 'react';

interface Raffle {
  id: number;
  name: string;
  description: string;
  prize: number;
  ticketsSold: number;
  totalTickets: number;
  endTime: Date;
  status: 'active' | 'completed';
}

interface User {
  points: number;
  tickets: { raffleId: number; ticketNumber: number }[];
}

const PRIZES = [10, 20, 50];
const TICKET_COST = 25;

export default function Home() {
  const [user, setUser] = useState<User>({ points: 500, tickets: [] });
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [selectedPrize, setSelectedPrize] = useState<number>(10);
  const [ticketsToBuy, setTicketsToBuy] = useState<number>(1);
  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    // Initialize raffles
    const initialRaffles: Raffle[] = PRIZES.map((prize, index) => ({
      id: index + 1,
      name: `$${prize} Prize Raffle`,
      description: `Win a ${prize} prize! Buy your tickets now.`,
      prize: prize,
      ticketsSold: Math.floor(Math.random() * 50),
      totalTickets: 100,
      endTime: new Date(Date.now() + 86400000 * 3), // 3 days from now
      status: 'active',
    }));
    setRaffles(initialRaffles);
  }, []);

  const buyTickets = (raffleId: number) => {
    const totalCost = ticketsToBuy * TICKET_COST;
    
    if (user.points < totalCost) {
      setNotification('Not enough points!');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    setUser(prev => ({
      points: prev.points - totalCost,
      tickets: [...prev.tickets, ...Array.from({ length: ticketsToBuy }, (_, i) => ({
        raffleId,
        ticketNumber: Math.floor(Math.random() * 10000) + 1,
      }))]
    }));

    setRaffles(prev => prev.map(r => 
      r.id === raffleId 
        ? { ...r, ticketsSold: r.ticketsSold + ticketsToBuy }
        : r
    ));

    setNotification(`Successfully bought ${ticketsToBuy} tickets!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const selectPrize = (prize: number) => {
    setSelectedPrize(prize);
    setRaffles(prev => prev.map(r => ({
      ...r,
      prize,
      name: `$${prize} Prize Raffle`,
      description: `Win a ${prize} prize! Buy your tickets now.`,
    })));
  };

  const activeRaffles = raffles.filter(r => r.status === 'active');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">🎰 Raffle Website</h1>
            <div className="flex items-center gap-4">
              <span className="text-lg">
                <span className="text-gray-600">Points:</span>{' '}
                <span className="font-bold text-green-600">{user.points}</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {notification && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {notification}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Prize Amount</h2>
          <div className="flex gap-4">
            {PRIZES.map(prize => (
              <button
                key={prize}
                onClick={() => selectPrize(prize)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedPrize === prize
                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                ${prize} Prize
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-2">🎫</div>
              <h3 className="font-bold text-lg mb-2">1. Buy Tickets</h3>
              <p className="text-gray-600">Each ticket costs 25 points. Choose how many tickets you want to buy.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-bold text-lg mb-2">2. Pick Your Prize</h3>
              <p className="text-gray-600">Choose from $10, $20, or $50 prize raffles. More tickets = better chances!</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-bold text-lg mb-2">3. Win Big!</h3>
              <p className="text-gray-600">Wait for the draw and see if you won! Results are announced after the raffle ends.</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Active Raffles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRaffles.map(raffle => (
              <div key={raffle.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                  <h3 className="text-xl font-bold text-white">{raffle.name}</h3>
                  <p className="text-indigo-100 text-sm mt-1">{raffle.description}</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-gray-600 text-sm">Prize:</span>
                      <p className="text-2xl font-bold text-green-600">${raffle.prize}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-600 text-sm">Tickets:</span>
                      <p className="font-bold">{raffle.ticketsSold}/{raffle.totalTickets}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round((raffle.ticketsSold / raffle.totalTickets) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${(raffle.ticketsSold / raffle.totalTickets) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tickets to Buy ({TICKET_COST} points each)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={Math.floor(user.points / TICKET_COST)}
                      value={ticketsToBuy}
                      onChange={(e) => setTicketsToBuy(Math.max(1, Math.min(parseInt(e.target.value) || 1, Math.floor(user.points / TICKET_COST))))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    onClick={() => buyTickets(raffle.id)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    Buy {ticketsToBuy} Ticket{ticketsToBuy > 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {user.tickets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Raffle</th>
                      <th className="text-left py-2">Ticket Number</th>
                      <th className="text-left py-2">Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.tickets.map((ticket, index) => {
                      const raffle = raffles.find(r => r.id === ticket.raffleId);
                      return (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2">{raffle?.name}</td>
                          <td className="py-2 font-mono">{ticket.ticketNumber}</td>
                          <td className="py-2 text-green-600 font-semibold">${raffle?.prize}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">🎉 Recent Winners</h2>
          <div className="space-y-3">
            {[
              { name: 'Alex', ticket: '12345', prize: '$20' },
              { name: 'Jordan', ticket: '67890', prize: '$10' },
              { name: 'Taylor', ticket: '54321', prize: '$50' },
            ].map((winner, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold">{winner.name}</p>
                  <p className="text-sm text-gray-600">Ticket: {winner.ticket}</p>
                </div>
                <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Won {winner.prize}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2024 Raffle Website. Play responsibly!</p>
        </div>
      </footer>
    </div>
  );
}
