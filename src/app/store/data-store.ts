// Supabase-backed data store for RVIBS FC
import { supabase } from '../lib/supabase';

export interface Player {
  id: string;
  name: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward' | 'Staff';
  role?: string; // e.g. 'Head Coach', 'Assistant Coach', 'Goalkeeper Coach'
  number: number;
  photo: string;
  nationality: string;
  appearances: number;
  goals: number;
  assists: number;
  biography: string;
}

export interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'completed';
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Match Report' | 'Transfer News' | 'Player Interview' | 'Club News';
  image: string;
  date: string;
  author: string;
  featured?: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: 'Match' | 'Training' | 'Behind the Scenes' | 'Fans';
  date: string;
}

export interface Standing {
  id: string;
  position: number;
  team: string;
  teamLogo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface ActivityLog {
  id: string;
  label: string;
  category: 'player' | 'fixture' | 'news' | 'gallery' | 'standing' | 'other';
  timestamp: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  type: 'motm' | 'player_of_month';
  active: boolean;
  options: PollOption[];
  createdAt: string;
}

export interface FanSpotlight {
  id: string;
  type: 'fan_of_month' | 'seal_of_season';
  name: string;
  photo: string;
  quote: string;
  since: string;
  period: string;
  active: boolean;
}

export interface AwayTrip {
  id: string;
  fixture: string;
  date: string;
  venue: string;
  departurePoint: string;
  departureTime: string;
  interestedFans: string[];
}

export interface MatchdayInfo {
  id: string;
  stadium: string;
  address: string;
  capacity: string;
  gatesOpen: string;
  tips: string[];
}

// ── helpers: map DB snake_case → camelCase ──────────────────────────────────

function toPlayer(r: any): Player {
  return {
    id: r.id, name: r.name, position: r.position, number: r.number ?? 0,
    role: r.role ?? '',
    photo: r.photo ?? '', nationality: r.nationality ?? 'Kenya',
    appearances: r.appearances ?? 0, goals: r.goals ?? 0,
    assists: r.assists ?? 0, biography: r.biography ?? '',
  };
}

function toFixture(r: any): Fixture {
  return {
    id: r.id, homeTeam: r.home_team, awayTeam: r.away_team,
    homeTeamLogo: r.home_team_logo ?? '', awayTeamLogo: r.away_team_logo ?? '',
    date: r.date, time: r.time, venue: r.venue, competition: r.competition,
    homeScore: r.home_score ?? undefined, awayScore: r.away_score ?? undefined,
    status: r.status,
  };
}

function toNews(r: any): NewsArticle {
  return {
    id: r.id, title: r.title, excerpt: r.excerpt, content: r.content,
    category: r.category, image: r.image ?? '', date: r.date,
    author: r.author, featured: r.featured ?? false,
  };
}

function toGallery(r: any): GalleryImage {
  return { id: r.id, url: r.url, title: r.title, category: r.category, date: r.date };
}

function toStanding(r: any): Standing {
  return {
    id: r.id, position: r.position ?? 0, team: r.team,
    teamLogo: r.team_logo ?? '', played: r.played ?? 0,
    won: r.won ?? 0, drawn: r.drawn ?? 0, lost: r.lost ?? 0,
    goalsFor: r.goals_for ?? 0, goalsAgainst: r.goals_against ?? 0,
    goalDifference: r.goal_difference ?? 0, points: r.points ?? 0,
  };
}

function toActivityLog(r: any): ActivityLog {
  return {
    id: r.id, label: r.label, category: r.category,
    timestamp: new Date(r.created_at).getTime(),
  };
}

// ── image upload helper ─────────────────────────────────────────────────────

export async function uploadImage(file: File, folder = 'general'): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('rvibs-images').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('rvibs-images').getPublicUrl(path);
  return data.publicUrl;
}

// ── DataStore class ─────────────────────────────────────────────────────────

class DataStore {
  private players: Player[] = [];
  private fixtures: Fixture[] = [];
  private news: NewsArticle[] = [];
  private gallery: GalleryImage[] = [];
  private standings: Standing[] = [];
  private activityLog: ActivityLog[] = [];
  private pollsData: Poll[] = [];
  private listeners: (() => void)[] = [];
  private loaded = false;

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Load all data from Supabase once
  async load(): Promise<void> {
    if (this.loaded) return;
    const [p, f, n, g, s, a, polls, opts, spotlights, trips, matchday] = await Promise.all([
      supabase.from('players').select('*').order('created_at'),
      supabase.from('fixtures').select('*').order('date'),
      supabase.from('news').select('*').order('created_at', { ascending: false }),
      supabase.from('gallery').select('*').order('created_at', { ascending: false }),
      supabase.from('standings').select('*').order('points', { ascending: false }),
      supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('polls').select('*').order('created_at', { ascending: false }),
      supabase.from('poll_options').select('*'),
      supabase.from('fan_spotlights').select('*').order('created_at', { ascending: false }),
      supabase.from('away_trips').select('*').order('date'),
      supabase.from('matchday_info').select('*').limit(1).maybeSingle(),
    ]);
    this.players   = (p.data ?? []).map(toPlayer);
    this.fixtures  = (f.data ?? []).map(toFixture);
    this.news      = (n.data ?? []).map(toNews);
    this.gallery   = (g.data ?? []).map(toGallery);
    this.standings = (s.data ?? []).map(toStanding);
    this.activityLog = (a.data ?? []).map(toActivityLog);
    this.pollsData = (polls.data ?? []).map(poll => ({
      id: poll.id, question: poll.question, type: poll.type, active: poll.active, createdAt: poll.created_at,
      options: (opts.data ?? []).filter((o: any) => o.poll_id === poll.id).map((o: any) => ({ id: o.id, text: o.text, votes: o.votes })),
    }));
    this.fanSpotlightsData = (spotlights.data ?? []).map((r: any) => ({
      id: r.id, type: r.type, name: r.name, photo: r.photo ?? '', quote: r.quote ?? '',
      since: r.since ?? '', period: r.period ?? '', active: r.active,
    }));
    this.awayTripsData = (trips.data ?? []).map((r: any) => ({
      id: r.id, fixture: r.fixture, date: r.date, venue: r.venue,
      departurePoint: r.departure_point ?? '', departureTime: r.departure_time ?? '',
      interestedFans: r.interested_fans ?? [],
    }));
    if (matchday.data) {
      const r = matchday.data;
      this.matchdayInfoData = { id: r.id, stadium: r.stadium, address: r.address ?? '', capacity: r.capacity ?? '', gatesOpen: r.gates_open ?? '', tips: r.tips ?? [] };
    }
    this.loaded = true;
    this.notify();
  }

  private async logActivity(label: string, category: ActivityLog['category']) {
    const { data } = await supabase.from('activity_log')
      .insert({ label, category })
      .select().single();
    if (data) {
      this.activityLog = [toActivityLog(data), ...this.activityLog].slice(0, 20);
    }
  }

  getActivityLog(): ActivityLog[] { return [...this.activityLog]; }

  // ── Players ───────────────────────────────────────────────────────────────
  getPlayers(): Player[] { return [...this.players]; }
  getPlayerById(id: string): Player | undefined { return this.players.find(p => p.id === id); }

  async addPlayer(player: Omit<Player, 'id'>): Promise<void> {
    const { data, error } = await supabase.from('players').insert({
      name: player.name, position: player.position, number: player.number,
      photo: player.photo, nationality: player.nationality,
      appearances: player.appearances, goals: player.goals,
      assists: player.assists, biography: player.biography,
    }).select().single();
    if (error) throw error;
    this.players.push(toPlayer(data));
    await this.logActivity(`Player added: ${player.name}`, 'player');
    this.notify();
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<void> {
    const db: any = {};
    if (updates.name !== undefined)        db.name = updates.name;
    if (updates.position !== undefined)    db.position = updates.position;
    if (updates.number !== undefined)      db.number = updates.number;
    if (updates.photo !== undefined)       db.photo = updates.photo;
    if (updates.nationality !== undefined) db.nationality = updates.nationality;
    if (updates.appearances !== undefined) db.appearances = updates.appearances;
    if (updates.goals !== undefined)       db.goals = updates.goals;
    if (updates.assists !== undefined)     db.assists = updates.assists;
    if (updates.biography !== undefined)   db.biography = updates.biography;
    const { error } = await supabase.from('players').update(db).eq('id', id);
    if (error) throw error;
    const idx = this.players.findIndex(p => p.id === id);
    if (idx !== -1) this.players[idx] = { ...this.players[idx], ...updates };
    await this.logActivity(`Player updated: ${this.players.find(p => p.id === id)?.name ?? id}`, 'player');
    this.notify();
  }

  async deletePlayer(id: string): Promise<void> {
    const p = this.players.find(p => p.id === id);
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (error) throw error;
    this.players = this.players.filter(p => p.id !== id);
    await this.logActivity(`Player removed: ${p?.name ?? id}`, 'player');
    this.notify();
  }

  // ── Fixtures ──────────────────────────────────────────────────────────────
  getFixtures(): Fixture[] { return [...this.fixtures]; }

  // Returns upcoming fixtures whose date+time is in the future, sorted soonest first
  getUpcomingFixtures(): Fixture[] {
    const now = new Date();
    return this.fixtures
      .filter(f => {
        if (f.status === 'completed') return false;
        if (f.homeTeam !== 'RVIBS FC' && f.awayTeam !== 'RVIBS FC') return false;
        const matchDateTime = new Date(`${f.date}T${f.time || '00:00'}`);
        return matchDateTime > now;
      })
      .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime());
  }

  getNextMatch(): Fixture | undefined {
    return this.getUpcomingFixtures()[0];
  }

  async addFixture(fixture: Omit<Fixture, 'id'>): Promise<void> {
    const { data, error } = await supabase.from('fixtures').insert({
      home_team: fixture.homeTeam, away_team: fixture.awayTeam,
      home_team_logo: fixture.homeTeamLogo ?? '', away_team_logo: fixture.awayTeamLogo ?? '',
      date: fixture.date, time: fixture.time, venue: fixture.venue,
      competition: fixture.competition, status: fixture.status,
      home_score: fixture.homeScore ?? null, away_score: fixture.awayScore ?? null,
    }).select().single();
    if (error) throw error;
    this.fixtures.push(toFixture(data));
    await this.logActivity(`Fixture added: ${fixture.homeTeam} vs ${fixture.awayTeam}`, 'fixture');
    this.notify();
  }

  async updateFixture(id: string, updates: Partial<Fixture>): Promise<void> {
    const db: any = {};
    if (updates.homeTeam !== undefined)     db.home_team = updates.homeTeam;
    if (updates.awayTeam !== undefined)     db.away_team = updates.awayTeam;
    if (updates.homeTeamLogo !== undefined) db.home_team_logo = updates.homeTeamLogo;
    if (updates.awayTeamLogo !== undefined) db.away_team_logo = updates.awayTeamLogo;
    if (updates.date !== undefined)         db.date = updates.date;
    if (updates.time !== undefined)         db.time = updates.time;
    if (updates.venue !== undefined)        db.venue = updates.venue;
    if (updates.competition !== undefined)  db.competition = updates.competition;
    if (updates.status !== undefined)       db.status = updates.status;
    if (updates.homeScore !== undefined)    db.home_score = updates.homeScore;
    if (updates.awayScore !== undefined)    db.away_score = updates.awayScore;
    const { error } = await supabase.from('fixtures').update(db).eq('id', id);
    if (error) throw error;
    const idx = this.fixtures.findIndex(f => f.id === id);
    if (idx !== -1) this.fixtures[idx] = { ...this.fixtures[idx], ...updates };
    await this.logActivity(`Fixture updated: ${this.fixtures.find(f => f.id === id)?.homeTeam} vs ${this.fixtures.find(f => f.id === id)?.awayTeam}`, 'fixture');
    this.notify();
  }

  async deleteFixture(id: string): Promise<void> {
    const f = this.fixtures.find(f => f.id === id);
    const { error } = await supabase.from('fixtures').delete().eq('id', id);
    if (error) throw error;
    this.fixtures = this.fixtures.filter(f => f.id !== id);
    await this.logActivity(`Fixture removed: ${f ? `${f.homeTeam} vs ${f.awayTeam}` : id}`, 'fixture');
    this.notify();
  }

  // ── News ──────────────────────────────────────────────────────────────────
  getNews(): NewsArticle[] { return [...this.news]; }
  getNewsById(id: string): NewsArticle | undefined { return this.news.find(n => n.id === id); }
  getFeaturedNews(): NewsArticle | undefined { return this.news.find(n => n.featured); }

  async addNews(article: Omit<NewsArticle, 'id'>): Promise<void> {
    const { data, error } = await supabase.from('news').insert({
      title: article.title, excerpt: article.excerpt, content: article.content,
      category: article.category, image: article.image, date: article.date,
      author: article.author, featured: article.featured ?? false,
    }).select().single();
    if (error) throw error;
    this.news.unshift(toNews(data));
    await this.logActivity(`Article published: ${article.title}`, 'news');
    this.notify();
  }

  async updateNews(id: string, updates: Partial<NewsArticle>): Promise<void> {
    const db: any = {};
    if (updates.title !== undefined)    db.title = updates.title;
    if (updates.excerpt !== undefined)  db.excerpt = updates.excerpt;
    if (updates.content !== undefined)  db.content = updates.content;
    if (updates.category !== undefined) db.category = updates.category;
    if (updates.image !== undefined)    db.image = updates.image;
    if (updates.date !== undefined)     db.date = updates.date;
    if (updates.author !== undefined)   db.author = updates.author;
    if (updates.featured !== undefined) db.featured = updates.featured;
    const { error } = await supabase.from('news').update(db).eq('id', id);
    if (error) throw error;
    const idx = this.news.findIndex(n => n.id === id);
    if (idx !== -1) this.news[idx] = { ...this.news[idx], ...updates };
    await this.logActivity(`Article updated: ${this.news.find(n => n.id === id)?.title ?? id}`, 'news');
    this.notify();
  }

  async deleteNews(id: string): Promise<void> {
    const n = this.news.find(n => n.id === id);
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
    this.news = this.news.filter(n => n.id !== id);
    await this.logActivity(`Article deleted: ${n?.title ?? id}`, 'news');
    this.notify();
  }

  // ── Gallery ───────────────────────────────────────────────────────────────
  getGallery(): GalleryImage[] { return [...this.gallery]; }

  async addGalleryImage(image: Omit<GalleryImage, 'id'>): Promise<void> {
    const { data, error } = await supabase.from('gallery').insert({
      url: image.url, title: image.title, category: image.category, date: image.date,
    }).select().single();
    if (error) throw error;
    this.gallery.unshift(toGallery(data));
    await this.logActivity(`Gallery image added: ${image.title}`, 'gallery');
    this.notify();
  }

  async deleteGalleryImage(id: string): Promise<void> {
    const g = this.gallery.find(g => g.id === id);
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
    this.gallery = this.gallery.filter(g => g.id !== id);
    await this.logActivity(`Gallery image removed: ${g?.title ?? id}`, 'gallery');
    this.notify();
  }

  // ── Standings ─────────────────────────────────────────────────────────────
  getStandings(): Standing[] {
    return [...this.standings].sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
  }

  async addStanding(standing: Omit<Standing, 'id'>): Promise<void> {
    const gd = (standing.goalsFor ?? 0) - (standing.goalsAgainst ?? 0);
    const { data, error } = await supabase.from('standings').insert({
      team: standing.team, team_logo: standing.teamLogo ?? '',
      position: standing.position ?? 0, played: standing.played ?? 0,
      won: standing.won ?? 0, drawn: standing.drawn ?? 0, lost: standing.lost ?? 0,
      goals_for: standing.goalsFor ?? 0, goals_against: standing.goalsAgainst ?? 0,
      goal_difference: gd, points: standing.points ?? 0,
    }).select().single();
    if (error) throw error;
    this.standings.push(toStanding(data));
    await this.logActivity(`Team added to standings: ${standing.team}`, 'standing');
    this.notify();
  }

  async updateStanding(id: string, updates: Partial<Standing>): Promise<void> {
    const db: any = {};
    if (updates.team !== undefined)          db.team = updates.team;
    if (updates.teamLogo !== undefined)      db.team_logo = updates.teamLogo;
    if (updates.position !== undefined)      db.position = updates.position;
    if (updates.played !== undefined)        db.played = updates.played;
    if (updates.won !== undefined)           db.won = updates.won;
    if (updates.drawn !== undefined)         db.drawn = updates.drawn;
    if (updates.lost !== undefined)          db.lost = updates.lost;
    if (updates.goalsFor !== undefined)      db.goals_for = updates.goalsFor;
    if (updates.goalsAgainst !== undefined)  db.goals_against = updates.goalsAgainst;
    if (updates.goalDifference !== undefined) db.goal_difference = updates.goalDifference;
    if (updates.points !== undefined)        db.points = updates.points;
    const { error } = await supabase.from('standings').update(db).eq('id', id);
    if (error) throw error;
    const idx = this.standings.findIndex(s => s.id === id);
    if (idx !== -1) this.standings[idx] = { ...this.standings[idx], ...updates };
    await this.logActivity(`Standings updated: ${this.standings.find(s => s.id === id)?.team ?? id}`, 'standing');
    this.notify();
  }

  async deleteStanding(id: string): Promise<void> {
    const s = this.standings.find(s => s.id === id);
    const { error } = await supabase.from('standings').delete().eq('id', id);
    if (error) throw error;
    this.standings = this.standings.filter(s => s.id !== id);
    await this.logActivity(`Team removed from standings: ${s?.team ?? id}`, 'standing');
    this.notify();
  }

  // ── Static / fan data (kept local — not critical to share) ────────────────
  private fanPhotos: any[] = [];
  private awayTripsData: AwayTrip[] = [];
  private fanSpotlightsData: FanSpotlight[] = [];
  private matchdayInfoData: MatchdayInfo | null = null;

  // ── Polls (Supabase-backed, real-time) ───────────────────────────────────
  getPolls(): Poll[] { return [...this.pollsData]; }

  async addPoll(question: string, type: 'motm' | 'player_of_month', options: string[]): Promise<void> {
    const { data: poll, error } = await supabase.from('polls').insert({ question, type, active: true }).select().single();
    if (error || !poll) throw error;
    const optRows = options.map(text => ({ poll_id: poll.id, text, votes: 0 }));
    const { data: opts } = await supabase.from('poll_options').insert(optRows).select();
    this.pollsData = [{ id: poll.id, question: poll.question, type: poll.type, active: true, createdAt: poll.created_at, options: (opts ?? []).map((o: any) => ({ id: o.id, text: o.text, votes: 0 })) }, ...this.pollsData];
    this.notify();
  }

  async closePoll(pollId: string): Promise<void> {
    await supabase.from('polls').update({ active: false }).eq('id', pollId);
    this.pollsData = this.pollsData.map(p => p.id === pollId ? { ...p, active: false } : p);
    this.notify();
  }

  async deletePoll(pollId: string): Promise<void> {
    await supabase.from('polls').delete().eq('id', pollId);
    this.pollsData = this.pollsData.filter(p => p.id !== pollId);
    this.notify();
  }

  async vote(pollId: string, optionId: string, voterKey: string): Promise<'ok' | 'already_voted'> {
    // Check if already voted
    const { data: existing } = await supabase.from('poll_votes').select('id').eq('poll_id', pollId).eq('voter_key', voterKey).maybeSingle();
    if (existing) return 'already_voted';
    // Record vote
    await supabase.from('poll_votes').insert({ poll_id: pollId, option_id: optionId, voter_key: voterKey });
    // Increment count
    const poll = this.pollsData.find(p => p.id === pollId);
    const opt = poll?.options.find(o => o.id === optionId);
    if (opt) {
      await supabase.from('poll_options').update({ votes: opt.votes + 1 }).eq('id', optionId);
      opt.votes += 1;
      this.notify();
    }
    return 'ok';
  }

  // Reload polls from Supabase (call after real-time update)
  async reloadPolls(): Promise<void> {
    const [{ data: polls }, { data: opts }] = await Promise.all([
      supabase.from('polls').select('*').order('created_at', { ascending: false }),
      supabase.from('poll_options').select('*'),
    ]);
    this.pollsData = (polls ?? []).map((poll: any) => ({
      id: poll.id, question: poll.question, type: poll.type, active: poll.active, createdAt: poll.created_at,
      options: (opts ?? []).filter((o: any) => o.poll_id === poll.id).map((o: any) => ({ id: o.id, text: o.text, votes: o.votes })),
    }));
    this.notify();
  }
  getFanPhotos() { return [...this.fanPhotos]; }
  getAwayTrips(): AwayTrip[] { return [...this.awayTripsData]; }

  async registerAwayTrip(tripId: string, fanName: string): Promise<void> {
    const trip = this.awayTripsData.find(t => t.id === tripId);
    if (!trip || trip.interestedFans.includes(fanName)) return;
    const updated = [...trip.interestedFans, fanName];
    await supabase.from('away_trips').update({ interested_fans: updated }).eq('id', tripId);
    trip.interestedFans = updated;
    this.notify();
  }

  getFanOfMonth(): FanSpotlight | null {
    return this.fanSpotlightsData.find(s => s.type === 'fan_of_month' && s.active) ?? null;
  }
  getSealOfSeason(): FanSpotlight | null {
    return this.fanSpotlightsData.find(s => s.type === 'seal_of_season' && s.active) ?? null;
  }

  async addFanSpotlight(spotlight: Omit<FanSpotlight, 'id'>): Promise<void> {
    // Deactivate existing of same type
    await supabase.from('fan_spotlights').update({ active: false }).eq('type', spotlight.type);
    const { data, error } = await supabase.from('fan_spotlights').insert({
      type: spotlight.type, name: spotlight.name, photo: spotlight.photo,
      quote: spotlight.quote, since: spotlight.since, period: spotlight.period, active: true,
    }).select().single();
    if (error) throw error;
    this.fanSpotlightsData = this.fanSpotlightsData.map(s => s.type === spotlight.type ? { ...s, active: false } : s);
    this.fanSpotlightsData.unshift({ ...spotlight, id: data.id, active: true });
    this.notify();
  }

  async deleteFanSpotlight(id: string): Promise<void> {
    await supabase.from('fan_spotlights').delete().eq('id', id);
    this.fanSpotlightsData = this.fanSpotlightsData.filter(s => s.id !== id);
    this.notify();
  }

  async addAwayTrip(trip: Omit<AwayTrip, 'id'>): Promise<void> {
    const { data, error } = await supabase.from('away_trips').insert({
      fixture: trip.fixture, date: trip.date, venue: trip.venue,
      departure_point: trip.departurePoint, departure_time: trip.departureTime,
      interested_fans: trip.interestedFans,
    }).select().single();
    if (error) throw error;
    this.awayTripsData.push({ ...trip, id: data.id });
    this.notify();
  }

  async deleteAwayTrip(id: string): Promise<void> {
    await supabase.from('away_trips').delete().eq('id', id);
    this.awayTripsData = this.awayTripsData.filter(t => t.id !== id);
    this.notify();
  }

  getMatchDayInfo(): MatchdayInfo {
    return this.matchdayInfoData ?? {
      id: '', stadium: 'Seals Arena', address: 'Nakuru, Kenya', capacity: '900',
      gatesOpen: '2 hours before kick-off',
      tips: ['Arrive early', 'Wear your blue and white with pride', 'Maximum fun guaranteed', 'Family Space available', 'Follow @rvib_seals on Instagram for live updates'],
    };
  }

  async updateMatchdayInfo(updates: Partial<MatchdayInfo>): Promise<void> {
    const current = this.getMatchDayInfo();
    const db: any = {};
    if (updates.stadium !== undefined)   db.stadium = updates.stadium;
    if (updates.address !== undefined)   db.address = updates.address;
    if (updates.capacity !== undefined)  db.capacity = updates.capacity;
    if (updates.gatesOpen !== undefined) db.gates_open = updates.gatesOpen;
    if (updates.tips !== undefined)      db.tips = updates.tips;
    if (current.id) {
      await supabase.from('matchday_info').update(db).eq('id', current.id);
    } else {
      const { data } = await supabase.from('matchday_info').insert({ stadium: current.stadium, address: current.address, capacity: current.capacity, gates_open: current.gatesOpen, tips: current.tips, ...db }).select().single();
      if (data) this.matchdayInfoData = { id: data.id, stadium: data.stadium, address: data.address, capacity: data.capacity, gatesOpen: data.gates_open, tips: data.tips };
      this.notify(); return;
    }
    this.matchdayInfoData = { ...current, ...updates };
    this.notify();
  }

  initStaticData() {
    this.fanPhotos = [
      { id: '1', url: '/src/images/fans-crowd.jpg', caption: 'Matchday atmosphere at its best', fanName: 'RVIBS FC', date: '2026-03-06' },
    ];
  }
}

export const dataStore = new DataStore();
