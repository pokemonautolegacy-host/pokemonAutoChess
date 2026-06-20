import { User } from "@firebase/auth-types";
import { PayloadAction } from "@reduxjs/toolkit";
import { Client, Room } from "colyseus.js";
import { IBot } from "../../../models/mongo-models/bot-v2";
import { IUserMetadata } from "../../../models/mongo-models/user-metadata";
import AfterGameState from "../../../rooms/states/after-game-state";
import GameState from "../../../rooms/states/game-state";
import PreparationState from "../../../rooms/states/preparation-state";
import { Emotion, ICustomLobbyState, Role, Title } from "../../../types";
import { EloRank } from "../../../types/Config";
import { BotDifficulty } from "../../../types/enum/Game";
import { Item } from "../../../types/enum/Item";
import { Language } from "../../../types/enum/Language";
import { PkmProposition } from "../../../types/enum/Pokemon";
import { SpecialGameRule } from "../../../types/enum/SpecialGameRule";
export interface INetwork {
    client: Client;
    lobby: Room<ICustomLobbyState> | undefined;
    preparation: Room<PreparationState> | undefined;
    game: Room<GameState> | undefined;
    after: Room<AfterGameState> | undefined;
    uid: string;
    displayName: string;
    profile: IUserMetadata | undefined;
    error: string | null;
}
export declare const networkSlice: import("@reduxjs/toolkit").Slice<INetwork, {
    logIn: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<User>) => void;
    logOut: (state: import("immer").WritableDraft<INetwork>) => void;
    setProfile: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<IUserMetadata>) => void;
    joinLobby: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<Room<ICustomLobbyState>>) => void;
    joinPreparation: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<Room<PreparationState>>) => void;
    joinGame: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<Room<GameState>>) => void;
    joinAfter: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<Room<AfterGameState>>) => void;
    sendMessage: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string>) => void;
    removeMessage: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        id: string;
    }>) => void;
    searchName: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string>) => void;
    changeName: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string>) => void;
    changeAvatar: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        index: string;
        emotion: Emotion;
        shiny: boolean;
    }>) => void;
    addBot: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<BotDifficulty | IBot>) => void;
    removeBot: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string>) => void;
    toggleReady: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<boolean>) => void;
    setNoElo: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<boolean>) => void;
    lockShop: (state: import("immer").WritableDraft<INetwork>) => void;
    levelClick: (state: import("immer").WritableDraft<INetwork>) => void;
    shopClick: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<number>) => void;
    pokemonPropositionClick: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<PkmProposition>) => void;
    itemClick: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<Item>) => void;
    gameStartRequest: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string>) => void;
    changeRoomName: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string>) => void;
    changeRoomPassword: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string | null>) => void;
    changeRoomMinMaxRanks: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        minRank: EloRank | null;
        maxRank: EloRank | null;
    }>) => void;
    setSpecialRule: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<SpecialGameRule | null>) => void;
    changeSelectedEmotion: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        index: string;
        emotion: Emotion;
        shiny: boolean;
    }>) => void;
    buyEmotion: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        index: string;
        emotion: Emotion;
        shiny: boolean;
    }>) => void;
    buyBooster: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        index: string;
    }>) => void;
    openBooster: (state: import("immer").WritableDraft<INetwork>) => void;
    showEmote: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string | undefined>) => void;
    searchById: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string>) => void;
    setTitle: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<Title>) => void;
    removeTournament: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        id: string;
    }>) => void;
    createTournamentLobbies: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        id: string;
    }>) => void;
    participateInTournament: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        tournamentId: string;
        participate: boolean;
    }>) => void;
    giveBooster: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        uid: string;
        numberOfBoosters: number;
    }>) => void;
    heapSnapshot: (state: import("immer").WritableDraft<INetwork>) => void;
    giveRole: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        uid: string;
        role: Role;
    }>) => void;
    giveTitle: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        uid: string;
        title: Title;
    }>) => void;
    kick: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string>) => void;
    deleteRoom: (state: import("immer").WritableDraft<INetwork>) => void;
    ban: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        uid: string;
        reason: string;
    }>) => void;
    unban: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        uid: string;
        name: string;
    }>) => void;
    deleteBotDatabase: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string>) => void;
    addBotDatabase: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string>) => void;
    selectLanguage: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<Language>) => void;
    createTournament: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<{
        name: string;
        startDate: string;
    }>) => void;
    setErrorAlertMessage: (state: import("immer").WritableDraft<INetwork>, action: PayloadAction<string | null>) => void;
}, "network", "network", import("@reduxjs/toolkit").SliceSelectors<INetwork>>;
export declare const heapSnapshot: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"network/heapSnapshot">, selectLanguage: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Language, "network/selectLanguage">, unban: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    uid: string;
    name: string;
}, "network/unban">, deleteBotDatabase: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/deleteBotDatabase">, addBotDatabase: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/addBotDatabase">, ban: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    uid: string;
    reason: string;
}, "network/ban">, pokemonPropositionClick: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<PkmProposition, "network/pokemonPropositionClick">, giveTitle: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    uid: string;
    title: Title;
}, "network/giveTitle">, giveRole: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    uid: string;
    role: Role;
}, "network/giveRole">, removeMessage: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    id: string;
}, "network/removeMessage">, removeTournament: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    id: string;
}, "network/removeTournament">, createTournamentLobbies: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    id: string;
}, "network/createTournamentLobbies">, participateInTournament: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    tournamentId: string;
    participate: boolean;
}, "network/participateInTournament">, giveBooster: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    uid: string;
    numberOfBoosters: number;
}, "network/giveBooster">, showEmote: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/showEmote">, openBooster: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"network/openBooster">, changeSelectedEmotion: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    index: string;
    emotion: Emotion;
    shiny: boolean;
}, "network/changeSelectedEmotion">, buyEmotion: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    index: string;
    emotion: Emotion;
    shiny: boolean;
}, "network/buyEmotion">, buyBooster: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    index: string;
}, "network/buyBooster">, changeRoomName: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/changeRoomName">, changeRoomPassword: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/changeRoomPassword">, changeRoomMinMaxRanks: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    minRank: EloRank | null;
    maxRank: EloRank | null;
}, "network/changeRoomMinMaxRanks">, setSpecialRule: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<SpecialGameRule, "network/setSpecialRule">, gameStartRequest: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/gameStartRequest">, logIn: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<User, "network/logIn">, logOut: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"network/logOut">, setProfile: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IUserMetadata, "network/setProfile">, joinLobby: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Room<ICustomLobbyState>, "network/joinLobby">, sendMessage: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/sendMessage">, searchName: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/searchName">, joinPreparation: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Room<PreparationState>, "network/joinPreparation">, joinGame: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Room<GameState>, "network/joinGame">, joinAfter: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Room<AfterGameState>, "network/joinAfter">, changeName: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/changeName">, changeAvatar: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    index: string;
    emotion: Emotion;
    shiny: boolean;
}, "network/changeAvatar">, addBot: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IBot | BotDifficulty, "network/addBot">, removeBot: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/removeBot">, toggleReady: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, "network/toggleReady">, setNoElo: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, "network/setNoElo">, itemClick: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Item, "network/itemClick">, shopClick: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<number, "network/shopClick">, levelClick: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"network/levelClick">, lockShop: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"network/lockShop">, searchById: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/searchById">, setTitle: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Title, "network/setTitle">, kick: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/kick">, deleteRoom: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"network/deleteRoom">, createTournament: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    name: string;
    startDate: string;
}, "network/createTournament">, setErrorAlertMessage: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "network/setErrorAlertMessage">;
declare const _default: import("redux").Reducer<INetwork>;
export default _default;
