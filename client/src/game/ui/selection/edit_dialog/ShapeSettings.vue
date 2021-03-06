<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import PanelModal from "../../../../core/components/modals/PanelModal.vue";
import AccessSettings from "./AccessSettings.vue";
import ExtraSettings from "./ExtraSettings.vue";
import PropertySettings from "./PropertySettings.vue";
import TrackerSettings from "./TrackerSettings.vue";

import { EventBus } from "@/game/event-bus";
import { Shape } from "@/game/shapes/shape";
import { Prop } from "vue-property-decorator";
import { gameStore } from "@/game/store";
import { createEmptyTracker } from "@/game/shapes/tracker";
import { createEmptyAura } from "@/game/shapes/aura";

@Component({
    components: {
        AccessSettings,
        ExtraSettings,
        PanelModal,
        PropertySettings,
        TrackerSettings,
    },
})
export default class ShapeSettings extends Vue {
    @Prop() shape!: Shape;

    visible = false;

    get owned(): boolean {
        return this.shape.ownedBy({ editAccess: true });
    }

    mounted(): void {
        EventBus.$on("EditDialog.Open", (shape: Shape) => {
            this.shape = shape;
            this.visible = true;
        });
        EventBus.$on("EditDialog.AddLabel", (label: string) => {
            if (this.visible) {
                this.shape.labels.push(gameStore.labels[label]);
                console.log("Label refresh");
            }
        });
    }

    beforeDestroy(): void {
        EventBus.$off("EditDialog.Open");
        EventBus.$off("EditDialog.AddLabel");
    }

    get categoryNames(): string[] {
        return ["Properties", "Trackers", "Access", "Extra"];
    }

    updated(): void {
        this.addEmpty();
    }

    addEmpty(): void {
        if (this.shape.trackers.length === 0 || !this.shape.trackers[this.shape.trackers.length - 1].temporary)
            this.shape.pushTracker(createEmptyTracker());
        if (this.shape.auras.length === 0 || !this.shape.auras[this.shape.auras.length - 1].temporary)
            this.shape.pushAura(createEmptyAura());
    }
}
</script>

<template>
    <PanelModal :visible.sync="visible" :categories="categoryNames">
        <template v-slot:title>{{ $t("game.ui.selection.edit_dialog.dialog.edit_asset") }}</template>
        <template v-slot:default="{ selection }">
            <PropertySettings v-show="selection === 0" :shape="shape" :owned="owned"></PropertySettings>
            <TrackerSettings v-show="selection === 1" :shape="shape" :owned="owned"></TrackerSettings>
            <AccessSettings v-show="selection === 2" :shape="shape" :owned="owned"></AccessSettings>
            <ExtraSettings
                v-show="selection === 3"
                :shape="shape"
                :owned="owned"
                :active="selection === 3"
            ></ExtraSettings>
        </template>
    </PanelModal>
</template>
