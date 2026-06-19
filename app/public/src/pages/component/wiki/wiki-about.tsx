import { useTranslation } from "react-i18next"
import { Item } from "../../../../../types/enum/Item"
import { ItemDetailTooltip } from "../../../game/components/item-detail"


export default function WikiAbout() {
  const { t } = useTranslation()
  return (
    <div className="wiki-about">
      <section className="my-box about-box">
        <h2>Pokemon Auto Legacy</h2>
        <p>Pokemon Auto Legacy (PAL) is an alternative to Pokemon Auto Chess for getting to experience old patches exactly as they were at the time. Players will be able to experience these legacy patches for about a months worth of time before swapping to a new version in which players will get to suggest and vote on to see. This is not meant to undermine the main server, but to instead let players have a chance to experience how the game was, for better or for worse. </p>
        <br></br>
        <p>There will be no bugfixes or balance changes from the original patch, there however may be versions of a patch chosen before or after hotfix changes, other than that things will be kept fully faithful to how the patch was on launch. And there are currently no plans to host previous versions past the current X.0 version of the game (for example if the current patch is 6.10, patch 6.4 would not be eligable for the legacy version).</p>
      </section>
      <section className="my-box about-box">
        <h2>Version</h2>
        <p>The current patch is: Patch 5.10, Ice Age</p>
      </section>
    </div>
  )
}