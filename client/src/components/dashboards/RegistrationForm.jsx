import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  createFreeRegistration,
  getMyRegistrationForEvent,
  updateMyRegistration
} from '../../api/registrationApi.js';
import useAuth from '../../hooks/useAuth.js';
import { getApiErrorMessage } from '../../utils/apiErrors.js';
import { saveRegistrationDraft } from '../../utils/paymentDraftStorage.js';
import GoogleLoginButton from '../auth/GoogleLoginButton.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import FloatingLabelField from '../common/FloatingLabelField.jsx';

const emptyPlayer = { name: '', phone: '', address: '' };

const buildInitialState = (event, user) => ({
  eventId: event._id,
  name: event.teamSize === 1 ? user?.name || '' : '',
  teamName: '',
  captainName: '',
  email: user?.email || '',
  phone1: '',
  phone2: '',
  address: '',
  players: []
});

const buildFormFromRegistration = (event, user, registration) => ({
  ...buildInitialState(event, user),
  eventId: registration.eventId?._id || event._id,
  name: registration.name || '',
  teamName: registration.teamName || '',
  captainName: registration.captainName || '',
  email: user?.email || registration.email || '',
  phone1: registration.phone1 || '',
  phone2: registration.phone2 || '',
  address: registration.address || '',
  players: Array.isArray(registration.players) ? registration.players : []
});

const hasPlayerDraftValues = (player) =>
  [player.name, player.phone, player.address].some((value) => value.trim());

const trimPlayer = (player) => ({
  name: player.name.trim(),
  phone: player.phone.trim(),
  address: player.address.trim()
});

const validatePlayerDraft = (player) => {
  const name = player.name.trim();
  const phone = player.phone.trim();
  const address = player.address.trim();

  if (name.length < 2) {
    return 'Player name must be at least 2 characters.';
  }

  if (phone.length < 8) {
    return 'Player phone must be at least 8 characters.';
  }

  if (address.length < 5) {
    return 'Player address must be at least 5 characters.';
  }

  return '';
};

export default function RegistrationForm({ event, onSuccess }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState(() => buildInitialState(event, user));
  const [playerDraft, setPlayerDraft] = useState({ ...emptyPlayer });
  const [editingPlayerIndex, setEditingPlayerIndex] = useState(null);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [loadingExistingRegistration, setLoadingExistingRegistration] = useState(false);
  const [playerError, setPlayerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setForm(buildInitialState(event, user));
    setPlayerDraft({ ...emptyPlayer });
    setEditingPlayerIndex(null);
    setExistingRegistration(null);
    setPlayerError('');
  }, [event, user]);

  useEffect(() => {
    let ignore = false;

    const loadExistingRegistration = async () => {
      if (!isAuthenticated || !event?._id) {
        setExistingRegistration(null);
        setLoadingExistingRegistration(false);
        return;
      }

      setLoadingExistingRegistration(true);

      try {
        const response = await getMyRegistrationForEvent(event._id);

        if (ignore) {
          return;
        }

        setExistingRegistration(response);
        setError('');

        if (response) {
          setForm(buildFormFromRegistration(event, user, response));
          setPlayerDraft({ ...emptyPlayer });
          setEditingPlayerIndex(null);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(getApiErrorMessage(requestError, 'Unable to load your saved registration details.'));
        }
      } finally {
        if (!ignore) {
          setLoadingExistingRegistration(false);
        }
      }
    };

    loadExistingRegistration();

    return () => {
      ignore = true;
    };
  }, [event, isAuthenticated, user]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const updatePlayerDraft = (field, value) => {
    setPlayerDraft((current) => ({
      ...current,
      [field]: value
    }));
    setPlayerError('');
  };

  const resetPlayerEditor = () => {
    setPlayerDraft({ ...emptyPlayer });
    setEditingPlayerIndex(null);
    setPlayerError('');
  };

  const savePlayerDraft = () => {
    if (editingPlayerIndex === null && form.players.length >= event.playerLimit) {
      setPlayerError(`Player count cannot exceed ${event.playerLimit}.`);
      return;
    }

    const validationError = validatePlayerDraft(playerDraft);

    if (validationError) {
      setPlayerError(validationError);
      return;
    }

    const nextPlayer = {
      name: playerDraft.name.trim(),
      phone: playerDraft.phone.trim(),
      address: playerDraft.address.trim()
    };

    setForm((current) => ({
      ...current,
      players:
        editingPlayerIndex === null
          ? [...current.players, nextPlayer]
          : current.players.map((player, index) =>
              index === editingPlayerIndex ? nextPlayer : player
            )
    }));

    resetPlayerEditor();
  };

  const handlePlayerEditorKeyDown = (eventValue) => {
    if (eventValue.key !== 'Enter') {
      return;
    }

    eventValue.preventDefault();
    savePlayerDraft();
  };

  const editPlayer = (index) => {
    setPlayerDraft({ ...form.players[index] });
    setEditingPlayerIndex(index);
    setPlayerError('');
    setError('');
  };

  const removePlayer = (index) => {
    setForm((current) => ({
      ...current,
      players: current.players.filter((_, playerIndex) => playerIndex !== index)
    }));

    if (editingPlayerIndex === index) {
      resetPlayerEditor();
      return;
    }

    if (editingPlayerIndex !== null && editingPlayerIndex > index) {
      setEditingPlayerIndex((current) => current - 1);
    }
  };

  const buildRegistrationPayload = (players = form.players) => ({
    ...form,
    email: user?.email || form.email,
    players
  });

  const validateRegistration = (players = form.players) => {
    if (event.teamSize === 1 && !form.name.trim()) {
      return 'Participant name is required.';
    }

    if (event.teamSize > 1 && !form.teamName.trim()) {
      return 'Team name is required.';
    }

    if (event.sportType === 'Cricket' && !form.captainName.trim()) {
      return 'Captain name is required for cricket registrations.';
    }

    if (!form.email.trim()) {
      return 'Email is required.';
    }

    if (form.phone1.trim().length < 8) {
      return 'Primary phone must be at least 8 digits.';
    }

    if (form.phone2.trim().length < 8) {
      return 'Secondary phone must be at least 8 digits.';
    }

    if (form.address.trim().length < 5) {
      return 'Address must be at least 5 characters.';
    }

    if (players.length > event.playerLimit) {
      return `Player count cannot exceed ${event.playerLimit}.`;
    }

    return '';
  };

  const handleFreeRegistration = async (registrationPayload) => {
    const response = await createFreeRegistration(registrationPayload);
    setExistingRegistration(response.registration);
    setForm(buildFormFromRegistration(event, user, response.registration));
    setSuccess('Registration saved successfully.');
    setError('');
    onSuccess?.(response.registration);
  };

  const handlePaidRegistration = async (registrationPayload) => {
    saveRegistrationDraft(event._id, registrationPayload);
    setSuccess('Registration details saved. Redirecting to payment methods...');
    setError('');
    navigate(`/events/${event._id}/payment`);
  };

  const handleRegistrationUpdate = async (registrationPayload) => {
    const response = await updateMyRegistration(existingRegistration._id, registrationPayload);
    setExistingRegistration(response);
    setForm(buildFormFromRegistration(event, user, response));
    setSuccess('Registration updated successfully.');
    setError('');
    onSuccess?.(response);
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    if (!isAuthenticated) {
      setError('Login is required before you can register.');
      return;
    }

    let playersForSubmission = form.players;
    const draftHasValues = hasPlayerDraftValues(playerDraft);
    const playerDraftValidationError = draftHasValues ? validatePlayerDraft(playerDraft) : '';

    if (draftHasValues && playerDraftValidationError) {
      setPlayerError(playerDraftValidationError);
      setError('Please save or fix the player currently being edited before continuing.');
      return;
    }

    if (draftHasValues && !playerDraftValidationError) {
      const nextPlayer = trimPlayer(playerDraft);

      playersForSubmission =
        editingPlayerIndex === null
          ? [...form.players, nextPlayer]
          : form.players.map((player, index) =>
              index === editingPlayerIndex ? nextPlayer : player
            );

      setForm((current) => ({
        ...current,
        players: playersForSubmission
      }));
      resetPlayerEditor();
    }

    const validationError = validateRegistration(playersForSubmission);

    if (validationError) {
      setError(validationError);
      return;
    }

    const registrationPayload = buildRegistrationPayload(playersForSubmission);

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (existingRegistration) {
        await handleRegistrationUpdate(registrationPayload);
        setSubmitting(false);
      } else if (Number(event.entryFee) > 0) {
        await handlePaidRegistration(registrationPayload);
        setSubmitting(false);
      } else {
        await handleFreeRegistration(registrationPayload);
        setSubmitting(false);
      }
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Registration failed.'));
      setSubmitting(false);
    }
  };

  return (
    <form className="public-panel space-y-5 p-4 sm:p-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">
            {existingRegistration ? 'Update Registration' : `Register for ${event.name}`}
          </h3>
          <p className="mt-2 text-sm text-[#a0a0a0]">
            {existingRegistration
              ? 'Add more players, revise the roster, or update your contact details without creating a second registration.'
              : `Fill the registration details and ${Number(event.entryFee) > 0 ? 'complete payment' : 'confirm your spot'}.`}
          </p>
        </div>
        <span className="public-chip">
          {existingRegistration
            ? 'Already registered'
            : Number(event.entryFee) > 0
              ? 'Payment required'
              : 'Free event'}
        </span>
      </div>

      {!isAuthenticated ? (
        <div className="public-panel-ghost border border-dashed border-[rgba(212,175,55,0.2)] p-4">
          <p className="mb-3 text-sm text-[#a0a0a0]">Use Google sign-in to continue with registration.</p>
          <GoogleLoginButton />
        </div>
      ) : null}

      {isAuthenticated ? (
        <div className="public-panel-ghost px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
            Signed in with Google
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-white">
                {user?.name || 'TriCore user'}
              </p>
              <p className="truncate text-sm text-[#a0a0a0]">{user?.email}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[#a0a0a0]">
              This registration will stay linked to your Google account.
            </div>
          </div>
        </div>
      ) : null}

      {loadingExistingRegistration ? (
        <div className="public-panel-ghost px-4 py-3">
          <LoadingSpinner compact label="Loading your saved registration details..." />
        </div>
      ) : null}

      {existingRegistration ? (
        <p className="rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[rgba(212,175,55,0.08)] px-4 py-3 text-sm text-[#f4d67a]">
          A registration already exists for this event. You can add more players or refresh the saved contact details below.
        </p>
      ) : null}

      <fieldset className="space-y-5 border-0 p-0">
        {event.teamSize === 1 ? (
          <FloatingLabelField
            dark
            id="name"
            label="Participant Name"
            onChange={(eventValue) => updateField('name', eventValue.target.value)}
            required
            value={form.name}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <FloatingLabelField
              dark
              id="teamName"
              label="Team Name"
              onChange={(eventValue) => updateField('teamName', eventValue.target.value)}
              required
              value={form.teamName}
            />
            {event.sportType === 'Cricket' ? (
              <FloatingLabelField
                dark
                id="captainName"
                label="Captain Name"
                onChange={(eventValue) => updateField('captainName', eventValue.target.value)}
                required
                value={form.captainName}
              />
            ) : null}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <FloatingLabelField
            dark
            id="email"
            helper="This stays synced with your signed-in Google account."
            label="Google Account Email"
            required
            readOnly
            type="email"
            value={user?.email || form.email}
          />
          <FloatingLabelField
            dark
            id="phone1"
            label="Primary Phone"
            onChange={(eventValue) => updateField('phone1', eventValue.target.value)}
            required
            value={form.phone1}
          />
          <FloatingLabelField
            dark
            id="phone2"
            label="Secondary Phone"
            onChange={(eventValue) => updateField('phone2', eventValue.target.value)}
            required
            value={form.phone2}
          />
          <div className="md:col-span-2">
            <FloatingLabelField
              dark
              id="address"
              label="Address"
              onChange={(eventValue) => updateField('address', eventValue.target.value)}
              required
              textarea
              value={form.address}
            />
          </div>
        </div>

        {event.teamSize > 1 ? (
          <div className="space-y-4 rounded-3xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Player List</h4>
                <p className="text-sm text-[#a0a0a0]">
                  Add up to {event.playerLimit} players now. You can keep the roster partial and update it later.
                </p>
              </div>
              <span className="public-chip w-fit">
                {form.players.length}/{event.playerLimit} players added
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#141414] p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h5 className="text-sm font-semibold text-white">
                  {editingPlayerIndex === null ? 'Add Player' : `Edit Player ${editingPlayerIndex + 1}`}
                </h5>
                {editingPlayerIndex === null ? (
                  <button
                    className="public-btn-secondary w-full sm:w-auto"
                    disabled={form.players.length >= event.playerLimit}
                    onClick={savePlayerDraft}
                    type="button"
                  >
                    Add Player
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button className="public-btn-secondary w-full sm:w-auto" onClick={resetPlayerEditor} type="button">
                      Cancel
                    </button>
                    <button className="public-btn-primary w-full sm:w-auto" onClick={savePlayerDraft} type="button">
                      Update
                    </button>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div onKeyDown={handlePlayerEditorKeyDown}>
                  <FloatingLabelField
                    dark
                    id="player-draft-name"
                    label="Player Name"
                    onChange={(eventValue) => updatePlayerDraft('name', eventValue.target.value)}
                    value={playerDraft.name}
                  />
                </div>
                <div onKeyDown={handlePlayerEditorKeyDown}>
                  <FloatingLabelField
                    dark
                    id="player-draft-phone"
                    label="Phone"
                    onChange={(eventValue) => updatePlayerDraft('phone', eventValue.target.value)}
                    value={playerDraft.phone}
                  />
                </div>
                <div className="md:col-span-2" onKeyDown={handlePlayerEditorKeyDown}>
                  <FloatingLabelField
                    dark
                    id="player-draft-address"
                    label="Address"
                    onChange={(eventValue) => updatePlayerDraft('address', eventValue.target.value)}
                    value={playerDraft.address}
                  />
                </div>
              </div>

              {playerError ? (
                <p className="mt-3 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {playerError}
                </p>
              ) : (
                <p className="mt-3 text-xs text-[#a0a0a0]">
                  Only saved players below are submitted. Save the draft row before updating the registration.
                </p>
              )}
            </div>

            {form.players.length ? (
              <>
                <div className="space-y-3 md:hidden">
                  {form.players.map((player, index) => (
                    <div
                      className="rounded-2xl border border-white/10 bg-[#141414] p-4"
                      key={`${player.name}-${player.phone}-${index}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0a0a0]">
                            Player {index + 1}
                          </p>
                          <p className="mt-2 text-base font-bold text-white">{player.name}</p>
                        </div>
                        <span className="public-chip-neutral">Saved</span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-[#a0a0a0]">
                        <p><span className="font-semibold text-white">Phone:</span> {player.phone}</p>
                        <p><span className="font-semibold text-white">Address:</span> {player.address}</p>
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          className="public-btn-secondary w-full"
                          onClick={() => editPlayer(index)}
                          type="button"
                        >
                          Edit Player
                        </button>
                        <button
                          className="public-btn-primary w-full"
                          onClick={() => removePlayer(index)}
                          type="button"
                        >
                          Remove Player
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-[#141414] md:block">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[rgba(255,255,255,0.03)] text-[#a0a0a0]">
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Player Name</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Address</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.players.map((player, index) => (
                        <tr className="border-t border-white/8" key={`${player.name}-${player.phone}-${index}`}>
                          <td className="px-4 py-4 font-semibold text-white">{index + 1}</td>
                          <td className="px-4 py-4 text-[#d9d9d9]">{player.name}</td>
                          <td className="px-4 py-4 text-[#d9d9d9]">{player.phone}</td>
                          <td className="px-4 py-4 text-[#d9d9d9]">{player.address}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                className="public-btn-secondary"
                                onClick={() => editPlayer(index)}
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                className="public-btn-primary"
                                onClick={() => removePlayer(index)}
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#141414] px-4 py-6 text-sm text-[#a0a0a0]">
                No players added yet. Add players one by one to build the team list.
              </div>
            )}
          </div>
        ) : null}

        <button className="public-btn-primary w-full sm:w-auto" disabled={submitting} type="submit">
          {submitting
            ? existingRegistration
              ? 'Updating...'
              : 'Processing...'
            : existingRegistration
              ? 'Update Registration'
              : Number(event.entryFee) > 0
                ? 'Continue to Payment'
                : 'Confirm Registration'}
        </button>
      </fieldset>

      {existingRegistration?.paymentId?.status ? (
        <p className="rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[#a0a0a0]">
          Current payment status: <span className="font-semibold">{existingRegistration.paymentId.status}</span>
        </p>
      ) : null}

      {error ? <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}
      {success ? <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</p> : null}
    </form>
  );
}
