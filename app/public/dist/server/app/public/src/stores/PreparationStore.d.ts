import { PayloadAction } from "@reduxjs/toolkit";
import { GameUser, IGameUser } from "../../../models/colyseus-models/game-user";
import Message from "../../../models/colyseus-models/message";
import { IChatV2 } from "../../../types";
import { EloRank } from "../../../types/enum/EloRank";
import { GameMode } from "../../../types/enum/Game";
import { SpecialGameRule } from "../../../types/enum/SpecialGameRule";
export interface IUserPreparationState {
    users: IGameUser[];
    gameStartedAt: string | null;
    ownerId: string;
    ownerName: string;
    messages: IChatV2[];
    name: string;
    password: string | null;
    noElo: boolean;
    minRank: EloRank | null;
    maxRank: EloRank | null;
    user: GameUser | undefined;
    gameMode: GameMode;
    specialGameRule: SpecialGameRule | null;
    whitelist: string[];
    blacklist: string[];
}
export declare const preparationSlice: import("@reduxjs/toolkit").Slice<IUserPreparationState, {
    setUser: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<GameUser>) => void;
    pushMessage: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<Message>) => void;
    removeMessage: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<Message>) => void;
    addUser: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<IGameUser>) => void;
    changeUser: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<{
        id: string;
        field: string;
        value: any;
    }>) => void;
    removeUser: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<string>) => void;
    setGameStarted: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<string | null>) => void;
    setOwnerId: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<string>) => void;
    setOwnerName: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<string>) => void;
    setName: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<string>) => void;
    setPassword: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<string | null>) => void;
    setNoELO: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<boolean>) => void;
    setSpecialGameRule: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<SpecialGameRule | null>) => void;
    setMinRank: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<EloRank | null>) => void;
    setMaxRank: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<EloRank | null>) => void;
    setGameMode: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<GameMode>) => void;
    resetPreparation: () => IUserPreparationState;
    setWhiteList: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<string[]>) => void;
    setBlackList: (state: import("immer").WritableDraft<IUserPreparationState>, action: PayloadAction<string[]>) => void;
}, "preparation", "preparation", import("@reduxjs/toolkit").SliceSelectors<IUserPreparationState>>;
export declare const setUser: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<GameUser, "preparation/setUser">, setName: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "preparation/setName">, pushMessage: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Message, "preparation/pushMessage">, removeMessage: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<Message, "preparation/removeMessage">, addUser: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<IGameUser, "preparation/addUser">, changeUser: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    id: string;
    field: string;
    value: any;
}, "preparation/changeUser">, removeUser: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "preparation/removeUser">, setGameStarted: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "preparation/setGameStarted">, setOwnerId: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "preparation/setOwnerId">, setOwnerName: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "preparation/setOwnerName">, setPassword: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "preparation/setPassword">, setNoELO: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, "preparation/setNoELO">, setMinRank: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EloRank, "preparation/setMinRank">, setMaxRank: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<EloRank, "preparation/setMaxRank">, setWhiteList: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string[], "preparation/setWhiteList">, setBlackList: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string[], "preparation/setBlackList">, setGameMode: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<GameMode, "preparation/setGameMode">, setSpecialGameRule: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<SpecialGameRule, "preparation/setSpecialGameRule">, resetPreparation: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"preparation/resetPreparation">;
declare const _default: import("redux").Reducer<IUserPreparationState>;
export default _default;
